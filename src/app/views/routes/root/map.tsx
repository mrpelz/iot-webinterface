import { styled } from 'goober';
import { FunctionComponent } from 'preact';
import { forwardRef, useEffect, useMemo, useRef } from 'preact/compat';
import type * as three from 'three/webgpu';

import floorPlanSTL from '../../../../common/assets/floor-plan/floor-plan.stl';
import { usePromise } from '../../../hooks/use-promise.js';
import { strings } from '../../../style.js';
import { useBreakpoint } from '../../../style/breakpoint.js';

const Wrapper = styled('wrapper' as 'section', forwardRef)`
  position: absolute;
  block-size: 100%;
  inline-size: 100%;
`;

export const Map: FunctionComponent = () => {
  const rendererRef = useRef<three.WebGPURenderer>(null);

  const isRetina3x = useBreakpoint(strings.isRetina3x);
  const isRetina2x = useBreakpoint(strings.isRetina2x);

  const devicePixelRatio = useMemo(() => {
    if (isRetina3x) return 3;
    if (isRetina2x) return 2;
    return 1;
  }, [isRetina2x, isRetina3x]);

  const wrapperRef = useRef<HTMLElement>(null);
  const three = usePromise(
    import(/* webpackChunkName: "three" */ 'three/webgpu'),
  );
  const threeOrbitControls = usePromise(
    import(
      /* webpackChunkName: "three-orbitcontrols" */ 'three/addons/controls/OrbitControls.js'
    ),
  );
  const threeSTLLoader = usePromise(
    import(
      /* webpackChunkName: "three-stlloader" */ 'three/addons/loaders/STLLoader.js'
    ),
  );

  useEffect(() => {
    const { current: wrapper } = wrapperRef;

    const abort = new AbortController();

    (async () => {
      if (!wrapper || !three || !threeOrbitControls || !threeSTLLoader) return;

      const scene = new three.Scene();
      scene.background = new three.Color('grey');

      const camera = new three.PerspectiveCamera(35, 1, 0.1, 100);
      camera.position.set(0, 20, 30);

      const material = new three.MeshNormalMaterial();

      const loader = new threeSTLLoader.STLLoader();
      const floorPlanGeometry = await loader.loadAsync(floorPlanSTL);
      floorPlanGeometry.rotateX(-(Math.PI / 2));
      floorPlanGeometry.center();
      const floorPlan = new three.Mesh(floorPlanGeometry, material);
      scene.add(floorPlan);

      // const boxGeometry = new three.BoxGeometry(2, 2, 2);
      // const cube = new three.Mesh(boxGeometry, material);
      // scene.add(cube);

      const renderer = new three.WebGPURenderer({ antialias: true });
      const controls = new threeOrbitControls.OrbitControls(
        camera,
        renderer.domElement,
      );
      controls.autoRotate = true;

      const resize = () => {
        camera.aspect = wrapper.clientWidth / wrapper.clientHeight;
        camera.updateProjectionMatrix();

        controls.update();

        floorPlanGeometry.center();

        renderer.setSize(wrapper.clientWidth, wrapper.clientHeight);
      };
      resize();

      const resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(wrapper);
      abort.signal.addEventListener(
        'abort',
        () => resizeObserver.unobserve(wrapper),
        { once: true },
      );

      rendererRef.current = renderer;
      wrapper.append(renderer.domElement);

      renderer.setAnimationLoop(() => {
        controls.update();
        renderer.render(scene, camera);
      });

      await renderer.init();
    })();

    return () => abort.abort();
  }, [three, threeOrbitControls, threeSTLLoader]);

  useEffect(() => {
    rendererRef.current?.setPixelRatio(devicePixelRatio);
  }, [devicePixelRatio]);

  return <Wrapper ref={wrapperRef} />;
};
