<script lang="ts">
  import * as PIXI from 'pixi.js'
  import { onMount } from 'svelte';

  import {Spine, SpineParser} from 'pixi-spine';
  import {STAGES, GAMES} from "../constants";

  const WIDTH = STAGES.WIDTH;
  const HEIGHT = STAGES.HEIGHT;
  const BG_COLOR = STAGES.BG_COLOR;

  let view: HTMLCanvasElement;
  let renderer: PIXI.Renderer;
  let stage: PIXI.Container;

  let oldTime: number = Date.now();
  let ms: number;
  const COE: number = 16.67;
  let animate = () => {
    let newTime: number = Date.now();
    let deltaTime: number = newTime - oldTime;
    ms = Math.round(GAMES.FPS * COE);
    // console.log("fps: " + GAMES.FPS + " " + "ms: " + ms);
    oldTime = newTime;
    deltaTime < 0 ? (deltaTime = 0) : deltaTime;
    deltaTime > ms ? (deltaTime = ms) : deltaTime;
    renderer.render(stage);
    requestAnimationFrame(animate);
  };

  // loader
  let loader: PIXI.Loader = new PIXI.Loader();

  // asset
  const ASSET_BG: string = "";
  const ASSET_PATTERN: string ="assets/images/pattern.png";
  const ASSET_SPINE1: string = "assets/spine/girl/Girl.json";
  const SPINEOBJ_NUM: number = 1; // now Fixed
  const anim_ary: string[] = [];
  const spineLoaderOptions: object = { metadata: { spineSkeletonScale: 0.5 } };
  let SP_HEIGHT: number;
  let spineObj: Spine[] = [];
  let isDragging: boolean = false;

  // json load
  // TODO: svelte fetch promise
  let jsonObj: { [s: string]: string };
  const req: XMLHttpRequest = new XMLHttpRequest();
  req.addEventListener(
    "load",
    () => {
      jsonObj = req.response;

      // get Animation name
      let names: string[] = [];

      // Get animation name by key name
      Object.keys(jsonObj.animations).forEach((ele) => {
        names.push(ele);
        anim_ary.push(ele);
      });

      let leng: number = names.length;
      for (let i: number = 0; i < leng; i++) {

        if (i === 0) {
          let divtemp: HTMLElement = <HTMLElement>document.createElement("div");
          divtemp.textContent = " ";
          document.body.appendChild(divtemp);
        }

        let button: HTMLButtonElement = <HTMLButtonElement>(
          document.createElement("button")
        );
        button.textContent = `${names[i]}`;
        button.onclick = function () {
          let animeObj: { [s: string]: number } = { animNum1: 0, animNum2: i };
          playAnimation(animeObj);
        };
        document.body.appendChild(button);

        let divider: HTMLElement = <HTMLElement>document.createElement("span");
        divider.textContent = " ";
        document.body.appendChild(divider);

        let newLine: HTMLElement = <HTMLElement>document.createElement("br");
        if (i === leng - 1) {
          document.body.appendChild(newLine);
        }
      }
    },
    false
  );

  let container_text: PIXI.Container;
  let container: PIXI.Container;
  let offsetX: number;

  let text_animationName: PIXI.Text;

  /**
   * Set Text for FPS value
   */
  const setTextFPS = () => {
    let text_fps = setText(
      `FPS: ${GAMES.FPS}`,
      "Arial",
      24,
      0x00cc00,
      "right",
      "bold"
    );
    container_text.addChild(text_fps);
    text_fps.x = WIDTH - text_fps.width - offsetX;
    text_fps.y = 440;
  };

  /**
   * Set Text for AnimeTimeScale value
   */
  const setTextAnimeTimeScale = () => {
    let text_anime_time_scale = setText(
      `Animation Time Scale: ${GAMES.ANIME_TIME_SCALE}`,
      "Arial",
      24,
      0x00cc00,
      "right",
      "bold"
    );
    container_text.addChild(text_anime_time_scale);
    text_anime_time_scale.x = WIDTH - text_anime_time_scale.width - offsetX;
    text_anime_time_scale.y = 410;
  };

  /**
   * Set Animation Loop value
   */
  const setTextAnimeLoop = () => {
    let text_anime_loop = setText(
      `Animation Loop: ${GAMES.ANIME_LOOP}`,
      "Arial",
      24,
      0x00cc00,
      "right",
      "bold"
    );
    container_text.addChild(text_anime_loop);
    text_anime_loop.x = WIDTH - text_anime_loop.width - offsetX;
    text_anime_loop.y = 380;
  };

  /**
   * Remeove text animationName
   * @param { PIXI.Text } targetText
   */
  let clearText = (t: PIXI.Text) => {
    t.text = "";
    container_text.removeChild(t);
  };

  /**
   * Set Text for animationName
   * (num1 : for multiple spine animations)
   */
  let displayAnimeName = (num1: number, num2: number) => {
    let animation: string = `animation: ${anim_ary[num2]}`;
    text_animationName = setText(
      animation,
      "Arial",
      24,
      0x33ccff,
      "center",
      "bold",
      "#000000",
      4,
      false,
      "#666666"
    );
    console.debug(num1);
    container_text.addChild(text_animationName);
    text_animationName.x = WIDTH - text_animationName.width - offsetX;
    text_animationName.y = 10;
  };

  /**
   * Set Text on TextField
   * @param { string | number } message
   * @param { string } fontfamily
   * @param { number } fontsize
   * @param { number } fillcolor
   * @param { string } align
   * @param { number } fontweight
   * @param { string } strokecolor
   * @param { number } sthickness
   * @param { boolean } isShadow
   * @param { string } shadowcolor
   *
   * @returns { object } PIXI.Text
   */
  let setText = (
    message: string | number,
    fontfamily: string = "Arial",
    fontsize: number = 12,
    fillcolor: number = 0xffffff,
    align: PIXI.TextStyleAlign = "left",
    fontweight: PIXI.TextStyleFontWeight = "normal",
    strokecolor: string = "#000000",
    sthickness: number = 0,
    isShadow: boolean = false,
    shadowcolor: string = "#000000"
  ) => {
    return new PIXI.Text(`${message}`, {
      fontFamily: fontfamily,
      fontSize: fontsize,
      fill: fillcolor,
      align: align,
      fontWeight: fontweight,
      stroke: strokecolor,
      strokeThickness: sthickness,
      dropShadow: isShadow,
      dropShadowColor: shadowcolor,
      lineJoin: "round",
    });
  };

  document.addEventListener("DOMContentLoaded", () => {
    let button: any;
    let btStart: number = 1;
    let btMaxLength: number = 100;

    for (let i: number = btStart; i <= btMaxLength; i++) {
      if (document.getElementById(`myButton${i}`)) {
        button = document.getElementById(`myButton${i}`);
        if (button) {
          let num1: number = button.name.substring(0, 1); // spineObj[n]
          let num2: number = button.name.substring(1, 2); // ex: aim, death, idle ...
          button.addEventListener(
            "click",
            {
              animNum1: num1,
              animNum2: num2,
              handleEvent: playAnimation,
              this: button,
            },
            false
          );
        }
      }
    }
  });

  /**
   * Play spine animation by anime name
   * @param { object } animation object
   */
  let playAnimation = (obj: any) => {
    // console.log("playAnimation()", obj);
    let num1: number = obj.animNum1;
    let num2: number = obj.animNum2;

    let animeObj: Spine = spineObj[num1];
    let animeName: string = anim_ary[num2];

    if (animeName === "") {
      console.log("there isn't animation name.");
      return false;
    }

    // set timescale
    animeObj.state.timeScale = GAMES.ANIME_TIME_SCALE;

    // play anime
    animeObj.state.setAnimation(0, animeName, GAMES.ANIME_LOOP);

    // clear text
    if (text_animationName) {
      clearText(text_animationName);
    }
    // show anime name text
    displayAnimeName(num1, num2);
  };

  /**
   * start drag
   * @param { object } event
   */
  let onDragStart = (e: PIXI.InteractionEvent) => {
    isDragging = true;
    let sp: PIXI.DisplayObject = e.currentTarget as PIXI.DisplayObject;
    sp.alpha = 0.75;
  };

  /**
   * stop drag
   * @param { object } event
   */
  let onDragEnd = (e: PIXI.InteractionEvent) => {
    isDragging = false;
    let sp: PIXI.DisplayObject = e.currentTarget;
    sp.alpha = 1;
  };

  /**
   * move drag
   * @param { object } event
   */
  let onDragMove = (e: PIXI.InteractionEvent) => {
    if (isDragging) {
      let sp: PIXI.DisplayObject = e.currentTarget;
      const point: { x: number; y: number } = e.data.global;
      sp.x = point.x;
      sp.y = point.y + SP_HEIGHT / 2;
    }
  };


  onMount(() => {
    renderer = new PIXI.Renderer({
      view: view,
      width: WIDTH,
      height: HEIGHT,
      backgroundColor: BG_COLOR,
    });

    stage = new PIXI.Container();

    req.open("GET", ASSET_SPINE1, true);
    req.responseType = "json";
    req.send(null);

    container = new PIXI.Container();
    container.width = WIDTH;
    container.height = HEIGHT;
    container.x = 0;
    container.y = 0;
    container.pivot.x = 0.5;
    container.pivot.y = 0.5;
    stage.addChild(container);

    // container for text
    container_text = new PIXI.Container();
    container_text.width = WIDTH;
    container_text.height = HEIGHT;
    container_text.x = 0;
    container_text.y = 0;
    container_text.pivot.x = 0.5;
    container_text.pivot.y = 0.5;
    stage.addChild(container_text);

    // bg
    let bg: PIXI.Sprite;

    // text
    let text_libVersion: PIXI.Text,
      text_animationName: PIXI.Text,
      // text_error: PIXI.Text,
      text_fps: PIXI.Text,
      text_anime_time_scale: PIXI.Text,
      text_anime_loop: PIXI.Text;
    offsetX = 10;

    if (ASSET_PATTERN !== "") {
      loader.add("pattern", ASSET_PATTERN);
    } else {
      if (ASSET_BG === "") {
        console.log("Don't use background image.");
      } else {
        loader.add("bg", ASSET_BG);
      }
    }
    // load

    loader.add("spineCharacter1", ASSET_SPINE1, spineLoaderOptions); // spine ver. 3.8 over must
    loader.load((loader: PIXI.Loader, resources: any) => {
      console.log(loader);
      console.log(resources);

      if (ASSET_PATTERN !== "") {
        const tilingSprite = new PIXI.TilingSprite(
          resources.pattern.texture,
          container.width,
          container.height,
        );
        tilingSprite.tileScale.x = 2;
        tilingSprite.tileScale.y = 2;
        container.addChild(tilingSprite);
      } else {
        // bg
        if (ASSET_BG !== "") {
          bg = new PIXI.Sprite(resources.bg.texture);
          container.addChild(bg);
        }
      }

      // text version
      let pixi_ver: string = PIXI.VERSION;
      let all_version: string = `PixiJS ${pixi_ver}\npixi-spine 3.0.13\nSpine 3.8\nrollup 2.50.5`;
      text_libVersion = setText(all_version, "Arial", 24, 0xf0fff0, "left", "bold");
      container_text.addChild(text_libVersion);
      text_libVersion.x = 10;
      text_libVersion.y = 10;

      setTextFPS();
      setTextAnimeTimeScale();
      setTextAnimeLoop();

      for (let i: number = 0; i <= SPINEOBJ_NUM - 1; i++) {
        spineObj[i] = new Spine(
          resources[`spineCharacter${i + 1}`].spineData
        );
        let sp: Spine = spineObj[i];
        sp.x = WIDTH / 2;
        sp.y = HEIGHT / 2 + sp.height / 2;
        SP_HEIGHT = sp.height;

        // sp.skeleton.setSkinByName("Normal_NoGun");
        sp.skeleton.setSkinByName("Normal");

        sp.pivot.x = 0.5;
        sp.pivot.y = 0.5;
        sp.interactive = true;
        sp.buttonMode = true;
        sp.on("pointerdown", onDragStart)
          .on("pointerup", onDragEnd)
          .on("pointerupoutside", onDragEnd)
          .on("pointermove", onDragMove);
        container.addChild(sp);
      }

      // app start
      requestAnimationFrame(animate);
    });

    loader.onError.add(() => {
      throw Error("load error ...");
    });

  });



  // let view;
  // let app;
  // app = new PIXI.Application({
  //   view,
  //   width: WIDTH,         // default: 800
  //   height: HEIGHT,        // default: 600
  //   antialias: true,    // default: false
  //   backgroundAlpha: false, // default: false
  //   resolution: 1,      // default: 1
  //   backgroundColor: 0x090f15
  //   // ...other props
  // });
</script>

<style>
  canvas {
    /*width: 100%;*/
    margin: 0 auto;
  }
</style>

<div class="content">
  <canvas bind:this={view}></canvas>
</div>