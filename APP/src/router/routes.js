import DashboardLayout from "@/layout/dashboard/DashboardLayout.vue";
// GeneralViews
import NotFound from "@/pages/NotFoundPage.vue";

// Admin pages
const Amplifier = () =>
  import(/* webpackChunkName: "dashboard" */ "@/pages/Amplifier.vue");
const Speaker = () =>
  import(/* webpackChunkName: "comon" */ "@/pages/Speaker.vue");
const Room = () =>
  import(/* webpackChunkName: "comon" */ "@/pages/Room.vue");
const Microphone = () =>
  import(/* webpackChunkName: "comon" */ "@/pages/Microphone.vue");
const Wave = () =>
  import(/* webpackChunkName: "comon" */ "@/pages/Wave.vue");

const routes = [
  {
    path: "/",
    component: DashboardLayout,
    redirect: "/amplifier",
    children: [
      {
        path: "amplifier",
        name: "amplifier",
        component: Amplifier,
      },
      {
        path: "speaker",
        name: "speaker",
        component: Speaker,
      },
      {
        path: "room",
        name: "room",
        component: Room,
      },
      {
        path: "microphone",
        name: "microphone",
        component: Microphone,
      },
      {
        path: "wave",
        name: "wave",
        component: Wave,
      }
    ],
  },
  { path: "*", component: NotFound },
];

/**
 * Asynchronously load view (Webpack Lazy loading compatible)
 * The specified component must be inside the Views folder
 * @param  {string} name  the filename (basename) of the view to load.
function view(name) {
   var res= require('../components/Dashboard/Views/' + name + '.vue');
   return res;
};**/

export default routes;
