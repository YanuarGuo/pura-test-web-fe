import { createRouter, createWebHistory } from "vue-router";

import crypto from "@/plugin/crypto";

import LoginView from "@/views/LoginView.vue";
import MainView from "@/views/MainView.vue";
import Dashboard from "@/components/dashboard/Index.vue";
import User from "@/components/masterdata/user/Index.vue";
import Role from "@/components/masterdata/role/Index.vue";
import Rooms from "@/components/masterdata/rooms/Index.vue";
import Reservation from "@/components/reservation/Index.vue";
import auth from "@/plugin/auth";
import UserAccess from "@/components/masterdata/akses/Index.vue";
import maintenance from "@/components/redirect/maintenance.vue";

import UserCreate from "@/components/masterdata/user/Create.vue";
import RoleCreate from "@/components/masterdata/role/Create.vue";
import RoomsCreate from "@/components/masterdata/rooms/Create.vue";
import ReservationCreate from "@/components/reservation/Create.vue";

import UserUpdate from "@/components/masterdata/user/Update.vue";
import RoleUpdate from "@/components/masterdata/role/Update.vue";
import UserData from "@/components/user/Update.vue";
import RoomsUpdate from "@/components/masterdata/rooms/Update.vue";
import ReservationUpdate from "@/components/reservation/Update.vue";

import ForbidenPage from "@/components/redirect/forbiden.vue";
import NotFoundPage from "@/components/redirect/notFound.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // INDEX
    {
      path: "/",
      name: "index",
      component: MainView,
      beforeEnter: async (to, from, next) => {
        let token = crypto.getToken();
        let access = await auth.getUserAccess();
        if (token != "" && access.success) {
          next({ name: "dashboard" });
        } else {
          next({ name: "login" });
        }
      },
    },
    // AUTH
    {
      path: "/login",
      name: "login",
      component: LoginView,
      beforeEnter: async (to, from, next) => {
        let token = crypto.getToken();
        let access = await auth.getUserAccess();
        if (token != "" && access.success) {
          next({ name: "dashboard" });
        } else {
          next();
        }
      },
    },
    {
      path: "/user-update/:id",
      name: "user-update",
      component: UserData,
      props: true,
      beforeEnter: async (to, from, next) => {
        let token = auth.jwtToken;
        if (token) {
          next();
        } else {
          next({ name: "login" });
        }
      },
    },
    // DASHBOARD
    {
      path: "/dashboard",
      name: "dashboard",
      component: Dashboard,
      beforeEnter: async (to, from, next) => {
        let token = crypto.getToken();
        let access = await auth.getUserAccess();
        if (token && access.success) {
          next();
        } else {
          next({ name: "index" });
        }
      },
    },
    // MASTERDATA
    {
      path: "/masterdata",
      name: "masterdata",
      // component: MasterData,
      beforeEnter: async (to, from, next) => {
        let token = auth.jwtToken;
        let access = await auth.getUserAccess();
        if (token && access.success) {
          next();
        } else {
          next({ name: "login" });
        }
      },
      children: [
        {
          path: "user",
          name: "masterdata-user",
          component: User,
        },
        {
          path: "user/create",
          name: "masterdata-user-create",
          component: UserCreate,
        },
        {
          path: "user/update/:id",
          name: "masterdata-user-update",
          component: UserUpdate,
          props: true,
        },
        {
          path: "role",
          name: "masterdata-role",
          component: Role,
        },
        {
          path: "role/create",
          name: "masterdata-role-create",
          component: RoleCreate,
        },
        {
          path: "role/update/:id",
          name: "masterdata-role-update",
          component: RoleUpdate,
          props: true,
        },
        {
          path: "akses/:id",
          name: "masterdata-akses",
          component: UserAccess,
          props: true,
        },
        {
          path: "rooms",
          name: "masterdata-rooms",
          component: Rooms,
        },
        {
          path: "rooms/create",
          name: "masterdata-rooms-create",
          component: RoomsCreate,
        },
        {
          path: "rooms/update/:id",
          name: "masterdata-rooms-update",
          component: RoomsUpdate,
          props: true,
        },
      ],
    },
    //TRANSACTIONAL
    {
      path: "/transactional",
      name: "transactional",
      // component: MasterData,
      beforeEnter: async (to, from, next) => {
        let token = auth.jwtToken;
        let access = await auth.getUserAccess();
        if (token && access.success) {
          next();
        } else {
          next({ name: "login" });
        }
      },
      children: [
        {
          path: "reservation",
          name: "transactional-reservation",
          component: Reservation,
        },
        {
          path: "reservation/create/:id",
          name: "transactional-reservation-create",
          component: ReservationCreate,
          props: true,
        },
        {
          path: "reservation/update/:id",
          name: "transactional-reservation-update",
          component: ReservationUpdate,
          props: true,
        },
      ],
    },
    //403 forbiden page
    {
      path: "/forbidden-page",
      name: "forbidden-page",
      component: ForbidenPage,
      beforeEnter: async (to, from, next) => {
        let token = auth.jwtToken;
        if (token) {
          next();
        } else {
          next({ name: "login" });
        }
      },
    },
    //404 not found page
    {
      path: "/:pathMatch(.*)*",
      name: "not-found",
      component: NotFoundPage,
      beforeEnter: async (to, from, next) => {
        let token = auth.jwtToken;
        if (token) {
          next();
        } else {
          next({ name: "login" });
        }
      },
    },
    // maintenance page
    {
      path: "/maintenance",
      name: "not-found",
      component: maintenance,
    },
  ],
});

export default router;
