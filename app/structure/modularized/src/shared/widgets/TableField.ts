import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class TableFieldWidget<RecordDataType = any> extends Vue {
  @Prop({ type: Object, default: () => ({}) })
  protected readonly row!: RecordDataType;
}
