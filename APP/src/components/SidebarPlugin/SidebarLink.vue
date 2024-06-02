<template>
  <li class="nav-item">
    <component :is="tag" class="nav-link" v-bind="$attrs" @click.native="hideSidebar">
      <slot>
        <div v-if="icon" class="image">
          <template>
            <div class="di">
              <img :src="icon" class="img"/>
            </div>
          </template>
          <p>{{ name }}</p>
        </div>
      </slot>
    </component>
  </li>
</template>

<script>
export default {
  name: "sidebar-link",
  inheritAttrs: false,
  inject: {
    autoClose: {
      default: true,
    },
    addLink: {
      default: () => { },
    },
    removeLink: {
      default: () => { },
    },
  },
  props: {
    name: String,
    icon: String, // This will now be the URL of the icon
    tag: {
      type: String,
      default: "router-link",
    },
  },
  methods: {
    hideSidebar() {
      if (this.autoClose) {
        this.$sidebar.displaySidebar(false);
      }
    },
    isActive() {
      return this.$el.classList.contains("active");
    },
  },
  mounted() {
    if (this.addLink) {
      this.addLink(this);
    }
  },
  beforeDestroy() {
    if (this.$el && this.$el.parentNode) {
      this.$el.parentNode.removeChild(this.$el);
    }
    if (this.removeLink) {
      this.removeLink(this);
    }
  },
};
</script>

<style>
.image {
  display: flex;
  align-items: center;
}
.img {
  width: 55px; 
  height: 55px; 
  object-fit: contain; /* Maintain aspect ratio */
  margin-right: 15px; /* Adjust the margin as needed */
}
</style>
