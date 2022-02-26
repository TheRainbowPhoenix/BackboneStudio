<script lang="ts">
    import Animation from "../Animation.svelte";
    import BaseTab from "../BaseTab.svelte";
    import {onMount} from "svelte";

    export let animation: any | null = {
        'bones':{}
    };

    export let opened: boolean = false;

    let animationBones: any = [];

    $: animationBones = (animation.bones === undefined) ? [] : Object.keys(animation.bones).map(k => {
        return {
            name: k,
            value: animation.bones[k],
        }
    });

    function toggleDrawer() {
        opened = !opened;
    }

</script>

<BaseTab name="Timeline" height="{opened ? '400px' : '0px'}">
    <div slot="tab-actions">
        <span
            class="btn btn-action"
            on:click={toggleDrawer}
        >{opened ? '▼' : '▲'}</span>
    </div>

    <div slot="header">
<!--        <input bind:value={filterTerm} placeholder="Filter"/>-->
    </div>


    <span>{JSON.stringify(animation)}</span>

    <ul slot="body" aria-label="Skins" class="list-container">

        {#each animationBones as bone}
            <li>
                <span>{bone.name}</span>
                {#if bone.value.rotate !== undefined}
                    <p>Rotate:
                        {#each bone.value.rotate as rotate}
                            <span>{JSON.stringify(rotate)}</span>
                        {/each}
                    </p>
                {/if}

                {#if bone.value.translate !== undefined}
                    <p>Translate:
                        {#each bone.value.translate as translate}
                            <span>{JSON.stringify(translate)}</span>
                        {/each}
                    </p>
                {/if}
            </li>
        {/each}
    </ul>

</BaseTab>

<style>
    .list-container {
        margin-block-end: 0;
        margin-block-start: 0;
        padding-left: 0;
        padding-bottom: 8px;
    }

    .btn {
        display: block;
        line-height: 28px;
        padding: 0 8px;
    }

    .btn:hover {
        background-color: #303132;
        cursor: pointer;
        transition: .2s all ease-in-out;
    }
</style>