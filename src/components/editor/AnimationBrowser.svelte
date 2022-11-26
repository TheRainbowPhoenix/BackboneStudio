<script lang="ts">
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  import Animation from "./Animation.svelte";
  import BaseTab from "./BaseTab.svelte";
  // TODO: remove any
  export let animations: any[] = [];

  let filterTerm: string = "";

  let selectedId: number = -1;

  function dispatchAnimation(name: string, id: number) {
    selectedId = id;
    dispatch("animationChange", {
      name: name,
      id: id,
    });
  }

  $: filteredAnimations = animations.filter(
    (item) => item.name.toLowerCase().indexOf(filterTerm.toLowerCase()) !== -1
  );
</script>

<BaseTab name="Animations">
  <div slot="header" class="header">
    <input class="filter-input" bind:value={filterTerm} placeholder="Filter" />
  </div>

  <ul slot="body" aria-label="Animations" class="list-container">
    {#each filteredAnimations as animation}
      <li class:selected={selectedId === animation.id}>
        <Animation
          bind:name={animation.name}
          bind:id={animation.id}
          on:click={() => dispatchAnimation(animation.name, animation.id)}
        />
      </li>
    {/each}
    {#if filteredAnimations.length == 0}
      <li><span>No items ...</span></li>
    {/if}
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
    transition: 0.4s background-color;
  }

  .tab-content {
    height: 100%;
  }

  .list-container {
    /*height: 100%;*/
    margin-block-end: 0;
    margin-block-start: 0;
    padding-left: 0;
    padding-bottom: 8px;
  }

  .tab-title {
    text-align: left;
  }

  .header {
    margin: 4px 6px;
  }

  .filter-input {
    width: 100%;
    margin: 0;
  }

  li {
    padding: 4px 6px;
  }
</style>
