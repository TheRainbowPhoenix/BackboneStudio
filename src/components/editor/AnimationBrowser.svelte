<script lang="ts">
    import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

    import Animation from "./Animation.svelte";
    // TODO: remove any
    export let animations: any[] = [];

	let filterTerm: string = "";

	let selectedId: number = -1;

	function dispatchAnimation(name: string, id: number) {
	    selectedId = id;
        dispatch('message', {
            text: 'text !',
            name: name,
            id: id,
        });
    }

    $: filteredAnimations = animations.filter(item => item.name.toLowerCase().indexOf(filterTerm.toLowerCase()) !== -1);

</script>

<input bind:value={filterTerm} placeholder="Filter"/>
<div class="scroller thin custom-scrollbar ">

    <ul aria-label="Animations" class="list-container">

    {#each filteredAnimations as animation}
        <li class:selected="{selectedId === animation.id}">
            <Animation bind:name={animation.name} bind:id={animation.id} on:click={() => dispatchAnimation(animation.name, animation.id)}/>
        </li>
    {/each}
    </ul>
</div>

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

    .list-container {
        height: 100%;
        margin-block-end: 0;
        margin-block-start: 0;
        padding-left: 0;
    }
</style>