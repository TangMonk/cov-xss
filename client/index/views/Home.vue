<style>
.home-content {
    display: flex;
}
.data-log-view {
    width: 100%;
    min-height: 100vh;
    background: #fff;
    margin-left: 1rem;
    box-shadow: 0 0 .5rem #d0d0d0;
}
.data-log-title-box {
    width: 100%;
    padding-right: 1rem;
    margin-right: 1rem;
}
.data-log-title {
    border: none;
    border-bottom: 1px solid #ccc;
    outline: none;
    font-size: 1rem;
    padding: .2rem .5rem;
    width: 100%;
}
.data-log-content {
    height: calc(100% - 6rem);
    padding: 0 1rem;
}
</style>

<template>
    <div class="home-content" v-load-more="{ method: loadMoreDataLog }" >
        <project-list :list="list" :show-project="showProject"></project-list>
        <div class="data-log-view">
            <div class="card-title">
                <div class="data-log-title-box">
                    记录
                </div>
                <div class="data-log-action">
                    <!-- <button class="card-title-btn" @click="saveAction">保存</button> -->
                </div>
            </div>
            <data-log :data-log-list="dataLogList" :state="state"></data-log>
        </div>
    </div>
</template>

<script>
import ProjectList from '../components/projectList.vue'
import ObjectView from '../components/ObjectView.vue'
import DataLog from '../components/DataLog.vue'

export default {
    name: 'Home',
    data () {
        return {
            state: {
                noMore: false,
                loading: false
            },
            query: {
                alias: ''
            },
            dataLogList: []
        }
    },
    mounted () {
        this.queryDataLog()
    },
    components: {
        ProjectList,
        ObjectView,
        DataLog
    },
    computed: {
        list () {
            return this.$store.state.Projects
        }
    },
    methods: {
        genDataLogQuery () {
            let query = new AV.Query('DataLog')
            if (this.query.alias) {
                query.equalTo('alias', this.query.alias)
            }
            query.limit(20)
            query.descending('createdAt')
            return query
        },
        showProject (item) {
            this.query.alias = item.get('alias')
            this.queryDataLog()
        },
        queryDataLog () {
            this.$Progress.start()
            this.genDataLogQuery()
                .find()
                .then(list => {
                    this.$Progress.finished()
                    this.dataLogList = list.map(item => {
                        item['__show'] = false
                        return item
                    })
                })
                .catch(err => {
                    this.$Progress.failed()
                })
        },
        loadMoreDataLog () {
            if (this.state.loading || this.state.noMore) return
            this.$Progress.start()
            this.state.loading = true
            this.genDataLogQuery()
                .skip(this.dataLogList.length)
                .find()
                .then(list => {
                    if (list.length < 20) {
                        this.state.noMore = true
                    }
                    this.$Progress.finished()
                    this.state.loading = false
                    this.dataLogList = this.dataLogList.concat(list.map(item => {
                        item['__show'] = false
                        return item
                    }))
                })
                .catch(err => {
                    this.state.loading = false
                    this.$Progress.failed()
                    console.log(err)
                })
        }
    }
} 
</script>