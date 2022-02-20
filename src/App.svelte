<script lang="ts">
	import Timeline from "./components/Timeline.svelte";
	import Header from "./components/Header.svelte";
	import Editor from "./components/Editor.svelte";

	export let name: string;

	// TODO: i18n
	// https://lokalise.com/blog/svelte-i18n/
</script>

<main>
	<Header />
	<Editor/>
	<Timeline/>
</main>

<style>
	main {
		text-align: center;
		padding: 0;
		margin: 0 auto;
		height: 100%;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>