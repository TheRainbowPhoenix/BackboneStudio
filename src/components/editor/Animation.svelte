<script lang="ts">
    export let name: string;
    export let id: string;
</script>

<div class="list-item" on:click>
    <div class="li-content" title="{name}">
        <div class="li-icon">
            <svg width="24" height="24" preserveAspectRatio="xMidYMid meet">
                <path fill="currentColor" d="M5 12a5.002 5.002 0 0 0 7 7c-3.87 0-7-3.13-7-7zm10-8c-1.13 0-2.16.37-3 1c3.87.01 7 3.14 7 7a5.002 5.002 0 0 0-4-8z" opacity=".3"/><path fill="currentColor" d="M12 7c-.6 0-1.17.11-1.7.3c-.19.53-.3 1.1-.3 1.7c0 2.76 2.24 5 5 5c.6 0 1.17-.11 1.7-.3c.19-.53.3-1.1.3-1.7c0-2.76-2.24-5-5-5z" opacity=".3"/><path fill="currentColor" d="M8 9a5.002 5.002 0 0 0 7 7c-3.87-.01-7-3.14-7-7z" opacity=".3"/><path fill="currentColor" d="M15 2c-2.71 0-5.05 1.54-6.22 3.78a7.062 7.062 0 0 0-3 3A7.014 7.014 0 0 0 2 15c0 3.87 3.13 7 7 7c2.71 0 5.05-1.54 6.22-3.78a7.062 7.062 0 0 0 3-3A7.014 7.014 0 0 0 22 9c0-3.87-3.13-7-7-7zM9 20a5.002 5.002 0 0 1-4-8c0 3.87 3.13 7 7 7c-.84.63-1.88 1-3 1zm3-3a5.002 5.002 0 0 1-4-8c0 3.86 3.13 6.99 7 7c-.84.63-1.88 1-3 1zm4.7-3.3c-.53.19-1.1.3-1.7.3c-2.76 0-5-2.24-5-5c0-.6.11-1.17.3-1.7c.53-.19 1.1-.3 1.7-.3c2.76 0 5 2.24 5 5c0 .6-.11 1.17-.3 1.7zM19 12c0-3.86-3.13-6.99-7-7a5.002 5.002 0 0 1 7 7z"/>
            </svg>
        </div>
        <div class="li-name">{name}</div>
    </div>

    <div class="li-controls">
        <div class="li-control">L</div>
        <div class="li-control">V</div>
    </div>

</div>

<style>
    .list-item {
        flex-grow: 0;
        user-select: none;
        -webkit-user-select: none;
        font-size: 12px;
        vertical-align: middle;
        min-width: 100%;
        display: flex;
        flex-direction: row;
        transition-property: background-color;
        transition-duration: 0.5s;
        border-radius: 4px;
        padding: 4px 0;
        position: relative;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-orient: horizontal;
        -webkit-box-direction: normal;
        -ms-flex-direction: row;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
    }

    .li-content {
        -webkit-box-flex: 1;
        -ms-flex: 1 1 auto;
        flex: 1 1 auto;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-orient: horizontal;
        -webkit-box-direction: normal;
        -ms-flex-direction: row;
        flex-direction: row;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
        min-width: 0;
        cursor: pointer;
    }

    .li-icon {
        max-width: 24px;
        max-height: 24px;
        margin: 0 4px;
        --li-icon-color: #d6dfef;
    }

    .li-icon svg {
        max-width: 24px;
        max-height: 24px;
    }

    .li-name {
        text-overflow: ellipsis;
        overflow: hidden;
        position: relative;

        font-size: 16px;
        line-height: 20px;
        -webkit-box-flex: 1;
        -ms-flex: 1 1 auto;
        flex: 1 1 auto;
        white-space: normal;
        width: 100%;
        text-align: left;
        padding: 0 2px;
    }

    .li-controls {
        padding-top: 4px;
        margin-left: auto;
        --li-color: #d6dfef;

        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
        -webkit-box-pack: center;
        -ms-flex-pack: center;
        justify-content: center;
        -webkit-box-flex: 0;
        -ms-flex: 0 0 auto;
        flex: 0 0 auto;
    }

    .li-controls .li-control {
        display: none;
    }

    .li-control {
        margin-right: 6px;
        opacity: 0;
        position: relative;
    }

    .list-item:hover > .li-controls .li-control {
        visibility: visible !important;
        transition: .4s all;
        opacity: 1;
        display: block;
    }

    .list-item:hover {
        /* TODO: use theme CSS */
        background-color: #303132;
        transition: .4s background-color;
    }
</style>