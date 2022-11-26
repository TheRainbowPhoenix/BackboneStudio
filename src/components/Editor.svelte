<script lang="ts">
  import * as PIXI from "pixi.js";
  import { onMount } from "svelte";

  import { Spine, SpineParser } from "pixi-spine";

  import { game_config, stage_config } from "../libs/game_store.ts";
  import AnimationBrowser from "./editor/AnimationBrowser.svelte";
  import BaseTab from "./editor/BaseTab.svelte";
  import SpeedTab from "./editor/SpeedTab.svelte";
  import SkinsBrowser from "./editor/SkinsBrowser.svelte";
  import Timeline from "./editor/animator/Timeline.svelte";

  let inspector_visible: boolean = false;

  let WIDTH;
  let HEIGHT;
  let BG_COLOR;

  let fps;
  let anime_loop;
  let anime_time_scale;

  let view: HTMLCanvasElement;
  let renderer: PIXI.Renderer;
  let stage: PIXI.Container;

  let current_spine: Spine;

  let current_point_pos: { x: number; y: number } = { x: 0, y: 0 };

  let loop = false;

  let current_skin_name: string = null;
  let current_scale: number = 100;

  let oldTime: number = Date.now();
  let ms: number;
  const COE: number = 16.67;
  let animate = () => {
    let newTime: number = Date.now();
    let deltaTime: number = newTime - oldTime;
    ms = Math.round(fps * COE);
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
  const ASSET_PATTERN: string = "assets/images/pattern.png";
  const ASSET_SPINE1: string = "assets/spine/girl/Girl.json"; // "assets/spine/bike/Bicycle.json"; // "assets/spine/girl/Girl.json"; //
  const SPINEOBJ_NUM: number = 1; // now Fixed
  const anim_ary: string[] = [];
  const skin_ary: string[] = [];
  let current_model: any = {};
  let current_animation: any = {};
  const spineLoaderOptions: object = { metadata: { spineSkeletonScale: 0.5 } };
  let SP_HEIGHT: number;
  let spineObj: Spine[] = [];
  let isDragging: boolean = false;

  let animations: any[] = [];
  let skins: any[] = [];

  let resources: any;

  // json load
  // TODO: svelte fetch promise
  let jsonObj: { [s: string]: string };
  const req: XMLHttpRequest = new XMLHttpRequest();
  req.addEventListener(
    "load",
    () => {
      jsonObj = req.response;

      current_model = jsonObj;
      console.log(current_model);

      // get Animation name
      let animations_list: string[] = [];

      console.debug(jsonObj);

      // Get animation name by key name
      Object.keys(jsonObj.animations).forEach((ele) => {
        animations_list.push(ele);
        anim_ary.push(ele);
      });

      let count = 0;
      // skins = jsonObj.skins
      skins = Object.values(jsonObj.skins).map((key) => {
        skin_ary.push(key);

        return {
          name: key?.name || "default",
          id: count++,
        };
      });

      count = 0;
      animations = animations_list.map((key) => ({
        name: key,
        id: count++,
      }));

      // console.log(animations);
      // console.log(skins);
    },
    false
  );

  let container_text: PIXI.Container;
  let container: PIXI.Container;
  let offsetX: number;

  let text_animationName: PIXI.Text;
  let text_anime_loop: PIXI.Text;

  /**
   * Remeove text animationName
   * @param { PIXI.Text } targetText
   */
  let clearText = (t: PIXI.Text) => {
    t.text = "";
    container_text.removeChild(t);
  };

  /**
   * Set Text for FPS value
   */
  const setTextFPS = () => {
    let text_fps = setText(
      `FPS: ${fps}`,
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
      `Animation Time Scale: ${anime_time_scale}`,
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
    if (text_anime_loop !== undefined) {
      clearText(text_anime_loop);
    }
    text_anime_loop = setText(
      `Animation Loop: ${anime_loop}`,
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

  // document.addEventListener("DOMContentLoaded", () => {
  //     let button: any;
  //     let btStart: number = 1;
  //     let btMaxLength: number = 100;
  //
  //     for (let i: number = btStart; i <= btMaxLength; i++) {
  //         if (document.getElementById(`myButton${i}`)) {
  //             button = document.getElementById(`myButton${i}`);
  //             if (button) {
  //                 let num1: number = button.name.substring(0, 1); // spineObj[n]
  //                 let num2: number = button.name.substring(1, 2); // ex: aim, death, idle ...
  //                 button.addEventListener(
  //                     "click",
  //                     {
  //                         animNum1: num1,
  //                         animNum2: num2,
  //                         handleEvent: playAnimation,
  //                         this: button,
  //                     },
  //                     false
  //                 );
  //             }
  //         }
  //     }
  // });

  let refreshAnimation = (obj: any) => {
    // console.log("playAnimation()", obj);
    let num1: number = obj.animNum1;
    let num2: number = obj.animNum2;

    if (current_spine !== null) {
      container.removeChild(current_spine);
    }

    current_spine = new Spine(resources[`spineCharacter1`].spineData);
    let sp = current_spine;

    let zoom = current_scale / 100;
    sp.scale.x = zoom;
    sp.scale.y = zoom;

    // console.log(current_point_pos);
    // console.log(zoom);
    // console.log(sp);

    sp.position.x =
      current_point_pos.x === 0
        ? WIDTH / 2 + (sp.width * zoom) / 2
        : current_point_pos.x;
    sp.position.y =
      current_point_pos.y === 0
        ? HEIGHT / 2 + (sp.height * zoom) / 2
        : current_point_pos.y + sp.height / 2;

    // sp.x = (current_point_pos.x !== 0) ? current_point_pos.x : WIDTH / 2;
    // sp.y = (current_point_pos.y !== 0) ? HEIGHT / 2 + sp.height / 2 : current_point_pos.y;
    // sp.y = HEIGHT / 2 + sp.height / 2; //+ sp.height / 2; // HEIGHT / 2; // + sp.height / 2;
    SP_HEIGHT = sp.height;

    // sp.skeleton.setSkinByName("Normal_NoGun");
    // sp.skeleton.setSkinByName("Normal");

    sp.pivot.x = 0.5;
    sp.pivot.y = 0.5;
    sp.interactive = true;
    sp.buttonMode = true;
    sp.on("pointerdown", onDragStart)
      .on("pointerup", onDragEnd)
      .on("pointerupoutside", onDragEnd)
      .on("pointermove", onDragMove);
    container.addChild(sp);

    let animeName: string = anim_ary[num2];

    if (animeName === "") {
      console.log("there isn't animation name.");
      return false;
    }

    // set timescale
    sp.state.timeScale = anime_time_scale;

    // let current_skin = skin_ary[current_skin_id].name;
    if (current_skin_name !== null && current_skin_name !== "default") {
      sp.skeleton.setSkinByName(current_skin_name);
    }
  };

  /**
   * Play spine animation by anime name
   * @param { object } animation object
   */
  let playAnimation = (obj: any) => {
    refreshAnimation(obj);

    let num1: number = obj.animNum1;
    let num2: number = obj.animNum2;

    if (current_spine === null) {
      return;
    }
    let animeObj: Spine = current_spine;
    let animeName: string = anim_ary[num2];

    // animeObj.drawDebug = debug;
    // animeObj.drawBones = bones;
    // animeObj.drawRegionAttachments = regionAttachments;
    // animeObj.drawClipping = clipping;
    // animeObj.drawMeshHull = meshHull;
    // animeObj.drawMeshTriangles = meshTriangles;
    // animeObj.drawPaths = paths;
    // animeObj.drawBoundingBoxes = boundingBoxes;

    // play anime
    animeObj.state.setAnimation(0, animeName, anime_loop);

    current_animation = current_model.animations[animeName];

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
      let pos: { x: number; y: number } = e.data.global;

      sp.x = pos.x;
      sp.y = pos.y + sp.height / 2;

      current_point_pos = {
        x: sp.position.x,
        y: sp.position.y,
      };
      // console.log(current_point_pos);
      // console.log(current_scale /100);
      // console.log(sp.position);
    }
  };

  onMount(() => {
    stage_config.subscribe((obj) => {
      WIDTH = obj.width;
      HEIGHT = obj.height;
      BG_COLOR = obj.bg_color;
    });

    game_config.subscribe((obj) => {
      fps = obj.fps;
      anime_loop = obj.anime_loop;
      anime_time_scale = obj.anime_time_scale;
    });

    WIDTH = window.innerWidth - (200 + 48);
    HEIGHT = window.innerHeight - 64;

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
    loader.load((loader: PIXI.Loader, rc: any) => {
      // console.log(loader);
      resources = rc;
      console.log(resources);

      if (ASSET_PATTERN !== "") {
        const tilingSprite = new PIXI.TilingSprite(
          resources.pattern.texture,
          container.width,
          container.height
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
      text_libVersion = setText(
        all_version,
        "Arial",
        24,
        0xf0fff0,
        "left",
        "bold"
      );
      container_text.addChild(text_libVersion);
      text_libVersion.x = 10;
      text_libVersion.y = 10;

      setTextFPS();
      setTextAnimeTimeScale();
      setTextAnimeLoop();

      // for (let i: number = 0; i <= SPINEOBJ_NUM - 1; i++) {
      //     spineObj[i] = new Spine(
      //         resources[`spineCharacter${i + 1}`].spineData
      //     );
      //     let sp: Spine = spineObj[i];
      //     sp.x = WIDTH / 2;
      //     sp.y = HEIGHT / 2 + sp.height / 2;
      //     SP_HEIGHT = sp.height;
      //
      //     // sp.skeleton.setSkinByName("Normal_NoGun");
      //     // sp.skeleton.setSkinByName("Normal");
      //
      //     sp.pivot.x = 0.5;
      //     sp.pivot.y = 0.5;
      //     sp.interactive = true;
      //     sp.buttonMode = true;
      //     sp.on("pointerdown", onDragStart)
      //         .on("pointerup", onDragEnd)
      //         .on("pointerupoutside", onDragEnd)
      //         .on("pointermove", onDragMove);
      //     container.addChild(sp);
      // }

      // app start
      requestAnimationFrame(animate);
    });

    loader.onError.add(() => {
      throw Error("load error ...");
    });
  });

  let lastAnimeObj: { [s: string]: number };

  function selectAnimation(name: string, id: number) {
    let animeObj: { [s: string]: number } = { animNum1: 0, animNum2: id };
    lastAnimeObj = animeObj;
    playState();
  }

  function selectAnimationSkin(name: string, id: number) {
    current_skin_name = name;
    playState();
  }

  function refreshState() {
    clearText(text_anime_loop);

    setTextAnimeLoop();
    if (lastAnimeObj !== undefined) {
      refreshAnimation(lastAnimeObj);
    }
  }

  function playState() {
    clearText(text_anime_loop);

    setTextAnimeLoop();
    if (lastAnimeObj !== undefined) {
      playAnimation(lastAnimeObj);
    }
  }

  function handleAnimationMessage(event) {
    // TODO: check types !
    selectAnimation(event.detail.name, event.detail.id);
    playState();
  }

  function handleSkinChange(event) {
    selectAnimationSkin(event.detail.name, event.detail.id);
    playState();
  }

  function handleSpeedChange(event) {
    playState();
  }

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

  let debug = false;
  let bones = false;
  let regionAttachments = false;
  let clipping = false;
  let meshHull = false;
  let meshTriangles = false;
  let paths = false;
  let boundingBoxes = false;

  const handleWheel = (e) => {
    if (e.deltaY > 0) {
      current_scale += 10;
    } else {
      current_scale -= 10;
    }
    e.preventDefault();
    refreshState();
  };
</script>

<svelte:window bind:innerWidth={WIDTH} bind:innerHeight={HEIGHT} />

<div class="workspace{inspector_visible ? ' inspected' : ''}">
  <div class="navbar-left flexr" />

  <div class="mainblock">
    <div class="canvas" on:wheel={handleWheel}>
      <canvas bind:this={view} />
    </div>

    <div class="inspector{inspector_visible ? ' open' : ''}">
      <div class="ins-body">
        <Timeline
          bind:animation={current_animation}
          bind:opened={inspector_visible}
        />
      </div>

      <div class="ins-ignored" />
    </div>
  </div>

  <div class="navbar-right flexr">
    <!--        <label>-->
    <!--            <input type=checkbox bind:checked={debug} on:change={refreshState}>-->
    <!--            Debug-->
    <!--        </label>-->
    <!--        <label>-->
    <!--            <input type=checkbox bind:checked={bones} on:change={refreshState}>-->
    <!--            Bones-->
    <!--        </label>-->
    <!--        <label>-->
    <!--            <input type=checkbox bind:checked={regionAttachments} on:change={refreshState}>-->
    <!--            Region Attachments-->
    <!--        </label>-->
    <!--        <label>-->
    <!--            <input type=checkbox bind:checked={clipping} on:change={refreshState}>-->
    <!--            Clipping-->
    <!--        </label>-->
    <!--        <label>-->
    <!--            <input type=checkbox bind:checked={meshHull} on:change={refreshState}>-->
    <!--            Mesh Hull-->
    <!--        </label>-->
    <!--        <label>-->
    <!--            <input type=checkbox bind:checked={meshTriangles} on:change={refreshState}>-->
    <!--            Mesh Triangles-->
    <!--        </label>-->
    <!--        <label>-->
    <!--            <input type=checkbox bind:checked={paths} on:change={refreshState}>-->
    <!--            Paths-->
    <!--        </label>-->
    <!--        <label>-->
    <!--            <input type=checkbox bind:checked={boundingBoxes} on:change={refreshState}>-->
    <!--            Bounding Boxes-->
    <!--        </label>-->
    <SpeedTab bind:loop={anime_loop} on:speedChange={handleSpeedChange} />
    <AnimationBrowser
      bind:animations
      on:animationChange={handleAnimationMessage}
    />
    <SkinsBrowser bind:skins on:skinChange={handleSkinChange} />
  </div>
</div>

<style>
  .mainblock {
    background: black;
  }

  @media (min-width: 926px) {
    .workspace {
      display: grid;
      grid-template-columns: 32px auto 200px;
      grid-template-rows: 100%;
    }

    .inspector {
      display: grid;
      grid-template-columns: auto calc(200px + 32px);
      grid-template-rows: 100%;
      background-color: #121212;
    }

    .ins-body {
      height: 100%;
    }
  }

  .workspace {
    max-height: calc(100vh - 54px);
  }

  /*.workspace.inspected {*/
  /*    height: calc(100vh - 30% - 54px);*/
  /*}*/

  canvas {
    /*width: 100%;*/
    margin: 0 auto;
  }

  .flexr {
    display: flex;
    flex-flow: row;
  }

  .navbar-right,
  .navbar-left {
    flex-direction: column;
    z-index: 80;
  }

  .navbar-right {
    margin-left: auto;
    /*width: 200px;*/
    width: 100%;
    overflow-x: auto;
  }

  .inspector {
    width: 100%;
    /* height: 100%; */
    position: fixed;
    bottom: 0;
    /*overflow-x: hidden;*/
    /*overflow-y: auto;*/
  }
  .inspector.open {
    height: 438px;
  }
</style>
