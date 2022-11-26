<script>
  export let values;
  export let type = "";

  export let scale = 400;
</script>

<div class="line">
  <div class="line-item">
    <div class="row-item">
      {#each values as val}
        <div
          class="key"
          data-key={JSON.stringify(val)}
          style="transform: translateX({val.time * scale ||
            '0'}px) rotate(45deg);"
        >
          <!-- TODO ?-->
        </div>
      {/each}
    </div>
  </div>
</div>

<style>
  .line {
    line-height: 24px;
    height: 24px;
  }

  .line-item {
    width: 100%;
    position: absolute;
    z-index: 1;
    line-height: 24px;
    height: 24px;

    transform: translateY(0px);
    pointer-events: none;
  }

  .row-item {
    height: 100%;
  }

  .key {
    width: 12px;
    height: 12px;
    background-color: #3b3c3d;
    border-radius: 2.5px;
    transition: background-color 0.3s;
    cursor: pointer;
    box-sizing: border-box;
    border: 2px solid transparent;
    background-clip: padding-box;

    position: absolute;
    top: 7px;
  }
</style>
