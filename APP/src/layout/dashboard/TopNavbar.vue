<template>
  <nav class="navbar navbar-expand-lg navbar-absolute"
    :class="{ 'bg-white': showMenu, 'navbar-transparent': !showMenu }">
    <div class="container-fluid">
      <div class="navbar-wrapper">
        <div class="navbar-toggle d-inline" :class="{ toggled: $sidebar.showSidebar }">
          <button type="button" class="navbar-toggler" aria-label="Navbar toggle button" @click="toggleSidebar">
            <span class="navbar-toggler-bar bar1"></span>
            <span class="navbar-toggler-bar bar2"></span>
            <span class="navbar-toggler-bar bar3"></span>
          </button>
        </div>
        <div style="display: flex;">
          <h1>CosTest<sup>®</sup></h1>
        </div>
      </div>
      <button class="navbar-toggler" type="button" @click="toggleMenu" data-toggle="collapse" data-target="#navigation"
        aria-controls="navigation-index" aria-label="Toggle navigation">
        <span class="navbar-toggler-bar navbar-kebab"></span>
        <span class="navbar-toggler-bar navbar-kebab"></span>
        <span class="navbar-toggler-bar navbar-kebab"></span>
      </button>

      <collapse-transition>
        <div class="collapse navbar-collapse show" v-show="showMenu">
          <ul class="navbar-nav" :class="$rtl.isRTL ? 'mr-auto' : 'ml-auto'">
            <!--Port selection-->
            <div class="input-group mb-3 container calc" style="align-items: center;">
              <p>{{ SelectedPort }}</p>
              <base-dropdown tag="li" :menu-on-right="!$rtl.isRTL" title-tag="a" class="nav-item"
                menu-classes="dropdown-navbar">
                <a slot="title" href="#" class="dropdown-toggle nav-link" data-toggle="dropdown" aria-expanded="true">
                  <div class="photo">
                    <img src="@/assets/icons/Com.png" />
                  </div>
                  <b class="caret d-none d-lg-block d-xl-block"></b>
                </a>
                <li v-for="port in ports" :key="port.value" class="nav-link">
                  <a href="#" :class="['nav-item dropdown-item', { disabled: port.disabled }]" @click="selectPort(port)"
                    :aria-disabled="port.disabled">
                    {{ port.text }}
                  </a>
                </li>
              </base-dropdown>
            </div>
            <!--Profile Part-->
            <base-dropdown tag="li" :menu-on-right="!$rtl.isRTL" title-tag="a" class="nav-item"
              menu-classes="dropdown-navbar">
              <a slot="title" href="#" class="dropdown-toggle nav-link" data-toggle="dropdown" aria-expanded="true">
                <div class="photo">
                  <img src="img/anime3.png" />
                </div>
                <b class="caret d-none d-lg-block d-xl-block"></b>
              </a>
              <li class="nav-link">
                <a href="#" class="nav-item dropdown-item">Profile</a>
              </li>
              <li class="nav-link">
                <a href="#" class="nav-item dropdown-item">Settings</a>
              </li>
              <div class="dropdown-divider"></div>
              <li class="nav-link">
                <a href="#" class="nav-item dropdown-item">Log out</a>
              </li>
            </base-dropdown>
          </ul>
        </div>
      </collapse-transition>
    </div>
  </nav>
</template>
<script>
import { CollapseTransition } from "vue2-transitions";
import Modal from "@/components/Modal";

export default {
  components: {
    CollapseTransition,
    Modal,
  },
  computed: {
    routeName() {
      const { name } = this.$route;
      return this.capitalizeFirstLetter(name);
    },
    isRTL() {
      return this.$rtl.isRTL;
    },
  },
  data() {
    return {
      activeNotifications: false,
      showMenu: false,
      searchModalVisible: false,
      searchQuery: "",
      ports: [
        { value: null, text: 'Please select a port', disabled: true },
        { value: 'port1', text: 'Port 1', disabled: true },
        { value: 'port2', text: 'Port 2', disabled: true },
        { value: 'Simulate', text: 'Simulate', disabled: false },
      ],
      SelectedPort: "Simulate",
    };
  },
  methods: {
    selectPort(port) {
      if (!port.disabled) {
        this.SelectedPort = port.text
        this.$globals.Port = port.text;
      }
    },
    capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    },
    closeDropDown() {
      this.activeNotifications = false;
    },
    toggleSidebar() {
      this.$sidebar.displaySidebar(!this.$sidebar.showSidebar);
    },
    hideSidebar() {
      this.$sidebar.displaySidebar(false);
    },
    toggleMenu() {
      this.showMenu = !this.showMenu;
    },
  },
};
</script>
<style></style>
