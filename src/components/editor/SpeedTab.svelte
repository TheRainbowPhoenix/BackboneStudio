<script lang="ts">
    import BaseTab from "./BaseTab.svelte";
    import {createEventDispatcher} from 'svelte';

    import {game_config} from "../../libs/game_store"

    const dispatch = createEventDispatcher();

    export let loop: Boolean = false;
    export let speed: Number = 100;

    function dispatchChange() {
        dispatch('speedChange', {
            loop: loop,
        });
    }

    function refreshState() {
        $game_config.anime_loop = loop;
        $game_config.anime_time_scale = speed / 100;
        dispatchChange()
    }


</script>

<BaseTab name="Speed" scrollable="false">
    <div slot="body" class="speed-body">
        <label>
            <input type="number" bind:value={speed} min="0" max="400" step="10" id="speedPercent" on:change={refreshState}/>
            %
            <input type=range bind:value={speed} min=0 max=400 step="10" on:change={refreshState}>
        </label>

        <label>
            <input type=checkbox bind:checked={loop} on:change={refreshState}>
            Loop
        </label>
    </div>
</BaseTab>

<style>

</style>