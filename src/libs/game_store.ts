import { writable } from 'svelte/store';

export const game_config = writable({
	anime_loop: false,
	fps: 60,
	anime_time_scale: 1,
});

export const stage_config = writable({
	width: 800,
	height: 600,
	bg_color: 0x000000
});


export const fps = writable(60);
export const anime_time_scale = writable(1);
export const anime_loop = writable(false);