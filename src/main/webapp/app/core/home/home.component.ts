import Component from 'vue-class-component';
import {Inject, Vue} from 'vue-property-decorator';
import LoginService from '@/account/login.service';
import Vue2Filters from "vue2-filters";

@Component({
  mixins: [Vue2Filters.mixin],
})
export default class Home extends Vue {
  @Inject('loginService')
  private loginService: () => LoginService;

  public openLogin(): void {
    this.loginService().openLogin((<any>this).$root);
  }

  public get authenticated(): boolean {
    return this.$store.getters.authenticated;
  }

  public get username(): string {
    return this.$store.getters.account?.login ?? '';
  }
}
