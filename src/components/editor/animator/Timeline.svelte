<script lang="ts">
  import Animation from "../Animation.svelte";
  import BaseTab from "../BaseTab.svelte";
  import { onMount } from "svelte";
  import ItemName from "./ItemName.svelte";
  import ItemLine from "./ItemLine.svelte";

  export let animation: any | null = {
    bones: {},
  };

  export let opened: boolean = false;

  let animationBones: any = [];

  $: animationBones =
    animation.bones === undefined
      ? []
      : Object.keys(animation.bones).map((k) => {
          return {
            name: k,
            value: animation.bones[k],
          };
        });

  function toggleDrawer() {
    opened = !opened;
  }

  let scale = 400;
</script>

<BaseTab name="Timeline" height={opened ? "400px" : "0px"}>
  <div slot="tab-actions">
    <span class="btn btn-action" on:click={toggleDrawer}
      >{opened ? "▼" : "▲"}</span
    >
  </div>

  <div slot="header">
    <!--        <input bind:value={filterTerm} placeholder="Filter"/>-->
  </div>

  <span>{JSON.stringify(animation)}</span>

  <div slot="body" aria-label="Skins" class="animator">
    <div class="list-container">
      <div class="item-name">
        <div class="items-tools">
          <div class="name">Properties</div>
          <div class="actions"><button>+</button></div>
        </div>
        {#each animationBones as bone, i}
          {#if bone.value.rotate !== undefined}
            <ItemName name={bone.name + " R"} />
          {/if}
          {#if bone.value.translate !== undefined}
            <ItemName name={bone.name + " T"} />
          {/if}
        {/each}
      </div>

      <div class="item-controls">
        <div class="item-timepoint">
          <span>0:00</span>
        </div>
        <div class="nodes">
          {#each animationBones as bone, i}
            {#if bone.value.rotate !== undefined}
              <ItemLine values={bone.value.rotate} type={"rotate"} {scale} />
            {/if}
            {#if bone.value.translate !== undefined}
              <ItemLine
                values={bone.value.translate}
                type={"translate"}
                {scale}
              />
            {/if}
          {/each}
        </div>
      </div>
    </div>
  </div>
</BaseTab>

<style>
  .animator {
    margin-block-end: 0;
    margin-block-start: 0;
    padding-left: 0;
    /* padding-bottom: 8px; */

    width: 100%;
    flex: 1;
    display: flex;
    flex-direction: column;
    user-select: none;
    background: var(--bg);
  }

  .list-container {
    height: 0;
    display: flex;
    flex: 1;
    position: relative;
  }

  .btn {
    display: block;
    line-height: 28px;
    padding: 0 8px;
  }

  .btn:hover {
    background-color: #303132;
    cursor: pointer;
    transition: 0.2s all ease-in-out;
  }

  .item-name {
    flex-direction: column;
    line-height: 20px;
    display: flex;
    border-right: 1px solid #262626;
    width: 20%; /* Todo: calculated (resizable)*/
  }

  .item-name > :global(.name):nth-child(2n) {
    background: rgba(60, 60, 60, 0.1);
  }

  .nodes > :global(.line):nth-child(2n) {
    background: rgba(60, 60, 60, 0.1);
  }

  .items-tools {
    display: flex;
    justify-content: space-between;
    border-top: 1px solid #262626;
    border-bottom: 1px solid #262626;
    height: 22px;
    min-height: 22px;
    line-height: 22px;
    background: #262626;
    padding: 2px 8px;
    overflow: hidden;
  }

  .items-tools .actions button {
    user-select: none;
    outline: none;

    height: 22px;
    padding: 0 4px;
    overflow: hidden;
    margin: 0;
    display: flex;
    line-height: 16px;
    background: #262626;
    border-radius: 0.25rem;
  }

  .item-timepoint {
    pointer-events: auto;
    display: flex;
    justify-content: space-between;
    border-top: 1px solid #262626;
    border-bottom: 1px solid #262626;
    height: 22px;
    min-height: 22px;
    line-height: 22px;
    background: #262626;
    padding: 2px 8px;
    overflow: hidden;
  }

  .item-controls {
    flex: 1;
    position: relative;
    overflow: hidden;
  }
</style>
