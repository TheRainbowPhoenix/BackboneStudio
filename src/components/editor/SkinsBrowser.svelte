<script lang="ts">
    import {createEventDispatcher} from 'svelte';

    const dispatch = createEventDispatcher();

    import Animation from "./Animation.svelte";
    import BaseTab from "./BaseTab.svelte";
    // TODO: remove any
    export let skins: any[] = [];

    let filterTerm: string = "";

    let selectedId: number = -1;

    function dispatchChange(name: string, id: number) {
        selectedId = id;
        dispatch('skinChange', {
            name: name,
            id: id,
        });
    }

    $: filteredskins = skins.filter(item => item.name.toLowerCase().indexOf(filterTerm.toLowerCase()) !== -1);

</script>

<BaseTab name="Skins" height="600px" >
    <div slot="header">
<!--        <input bind:value={filterTerm} placeholder="Filter"/>-->
    </div>

    <ul slot="body" aria-label="Skins" class="list-container">

        {#each filteredskins as skin}
            <li class:selected="{selectedId === skin.id}">
                <Animation bind:name={skin.name} bind:id={skin.id} on:click={() => dispatchChange(skin.name, skin.id)}/>
            </li>
        {/each}
    </ul>

</BaseTab>


<style>
    .scroller {
        overflow: hidden scroll;
        padding-right: 0px;
    }

    .selected {
        font-weight: bold;
    }

    .selected :global(.list-item) {
        /* TODO: use theme CSS */
        background-color: #3b3c3d;
        transition: .4s background-color;
    }

    .tab-content {
        height: 100%;
    }

    .list-container {
        /*height: 100%;*/
        margin-block-end: 0;
        margin-block-start: 0;
        padding-left: 0;
        padding-bottom: 6px;
    }

    .tab-title {
        text-align: left;

    }
</style>