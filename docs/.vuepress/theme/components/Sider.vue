<script>
    import Platform from '../components/Platform';
    import SiderChild from '../components/SiderChild';

    export default {
        data() {
            return {
                localePath: '',
                path: '', // 去除语言目录路径
                uri: '',
                root: '',
                language: '',
                version: '',
                file: '',
                sidebar: []
            }
        },
        components: {
            Platform,
            SiderChild
        },
        created() {
            this.localePath = this.$localePath;
            this.uri = this.$page.path;
            const locales = this.$site.themeConfig.locales[this.localePath];
            const path = this.$route.path.replace('/en/', '/');
            let temp = path.split('/');
            temp.splice(temp.length - 1, 1, '');
            this.root = temp[1] ? temp[1] : '';
            this.language = temp[2] ? temp[2] : '';
            this.version = temp[3] ? temp[3] : '';
            this.sidebar = locales.sidebar[temp.join('/')];
            this.path = this.$localePath + this.root + '/' + (this.language ? this.language + '/' : '');

            temp = this.$page.regularPath.split('/');
            this.file = temp[temp.length - 1];

            if (!this.sidebar) {
                for (let i = temp.length - 2; i > 0 ; i--) {
                    let tempPath = '/';
                    for (let j = 1; j <= i; j++) {
                        tempPath += temp[j] + '/';
                    }
                    
                    this.sidebar = locales.sidebar[tempPath];
                    if (this.sidebar) {
                        break;
                    }
                }
            }
        }
    }
</script>

<template>
    <div class="sider-container">
        <Platform :key="uri"/>
        <div class="sider-menu">
            <div class="item" v-for="group in sidebar" v-if="(group.show === undefined || group.show !== false) && (!language || ((!group.only && !group.except) || (group.only && group.only.indexOf(language) !== -1) || (group.except && group.except.indexOf(language) === -1)))">
                <h2>{{ group.title }}</h2>
                <ul>
                    <li v-for="item in group.children" :class="{active: item.link == file}" v-if="(item.show === undefined || item.show !== false) && (!language || ((!item.only && !item.except) || (item.only && item.only.indexOf(language) !== -1) || (item.except && item.except.indexOf(language) === -1)))">
                        <template v-if="item.children">
                            <SiderChild :key="item.children[0].link + 'sider-child'" :menu="item" />
                        </template>
                        <template v-else>
                            <router-link :to="item.link.slice(0, 1) == '/' ? item.link : (path + item.link)" v-if="(item.show === undefined || item.show !== false) && (!language || ((!item.only && !item.except) || (item.only && item.only.indexOf(language) !== -1) || (item.except && item.except.indexOf(language) === -1)))">{{ item.text }}</router-link>
                        </template>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<style>
    .sider-container {
        position: relative;
        padding: 20px;
        width: 270px;
        height: 100%;
        background-color: #f7f7fa;
        overflow: hidden auto;
    }
    .sider-menu .item+.item {
        margin-top: 36px;
    }
    .sider-menu h2 {
        font-size: 16px;
        font-weight: 500;
        line-height: 19px;
        color: #191919;
    }
    .sider-menu li {
        margin-top: 15px;
    }
    .sider-menu li a {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-family: HelveticaNeue;
        font-size: 14px;
        line-height: 16px;
        color: #586376;
        transition: all .3s;
    }
    .sider-menu li a:hover, .sider-menu li.active a {
        color: #1890ff;
    }
    .sider-menu li ul {
        padding-left: 12px;
        border-left: 2px solid #dfdfe5;
        transition: all .3s;
    }
    .sider-menu li ul li.active {
        margin-left: -14px;
        padding-left: 12px;
        border-left: 2px solid #1890ff;
    }
</style>