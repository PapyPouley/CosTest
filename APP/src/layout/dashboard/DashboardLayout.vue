<template>
  <div class="wrapper">
    <side-bar>
      <template slot="links">
        <sidebar-link to="/amplifier" :name="$t('sidebar.amplifier.name')" :icon="$t('sidebar.amplifier.icon')" />
        <sidebar-link to="/speaker" :name="$t('sidebar.speaker.name')" :icon="$t('sidebar.speaker.icon')" />
        <sidebar-link to="/microphone" :name="$t('sidebar.microphone.name')" :icon="$t('sidebar.microphone.icon')" />
        <sidebar-link to="/room" :name="$t('sidebar.room.name')" :icon="$t('sidebar.room.icon')" />
      </template>
    </side-bar>
    <div class="main-panel">
      <top-navbar></top-navbar>

      <dashboard-content @click.native="toggleSidebar"> </dashboard-content>

      <content-footer></content-footer>
    </div>
  </div>
</template>
<style lang="scss"></style>

<script>
import TopNavbar from "./TopNavbar.vue";
import ContentFooter from "./ContentFooter.vue";
import DashboardContent from "./Content.vue";
import MobileMenu from "./MobileMenu";

export default {
  components: {
    TopNavbar,
    ContentFooter,
    DashboardContent,
  },
  methods: {
    toggleSidebar() {
      if (this.$sidebar.showSidebar) {
        this.$sidebar.displaySidebar(false);
        console.log(this.$sidebar)
      }
    },
  },
};
</script>
