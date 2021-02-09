import UTILS from "../utils"

export default {
  methods: {
    getModelFromSchema(schema) {
      if(UTILS.isArr()) {
        return schema.map( ({model}) => model );
      }
      return schema.model;
    }
  }
}