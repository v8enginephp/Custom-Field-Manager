<template>
  <div>
    <div v-for="item of inputs" v-html="generateInput(item)" class="col-md"></div>
  </div>
</template>

<script>
export default {
  props: {
    fields: {
      required: true
    }
  },
  data() {
    return {
      inputs: JSON.parse(this.fields)
    };
  },
  methods: {
    generateInput(item) {
      let output = "";

      switch (item.type) {
        case "select":
          output = `
            <div class="form-group">
                <label for="${item.name}">${item.label}</label>
                <p class="small text-muted" style="white-space: break-spaces">${item.hint}</p>
                <select class="form-control" name="${item.name}" id="${item.name}" ${item.require === true ? "data-require='1'" : ""}>`;

          output+=`<option value="">یک گزینه انتخاب فرمایید.</option>`
          for(const option of item.options.split('\n')){
            output+=`<option>${option}</option>`
          }
          output+=`" </select> </div> `;

          break;
        case "textarea":
          output = `
          <div class="form-group">
            <label for="${item.name}">${item.label}</label>
            <p class="small text-muted" style="white-space: break-spaces">${item.hint}</p>
            <textarea
              placeholder="${item.placeholder}"
              rows="${item.row}"
              type="${item.type}"
              id="${item.name}"
              name="${item.name}"
              ${item.require === true ? "data-require='1'" : ""}
              class="form-control ${item.class ? item.class : ""}">${item.value}</textarea>
          </div>
          `;
          break;
        case "checkbox":
          output = `
            <div class="form-group form-check">
              <label class="form-check-label">
              <p class="small text-muted" style="white-space: break-spaces">${item.hint}</p>
              <input
                name="${item.name}"
                id="${item.name}"
                class="form-check-input ${item.class ? item.class : ""}"
                ${item.require === true ? "data-require='1'" : ""}
                type="checkbox"> ${item.label}</label>
            </div>
            `;
          break;
        case "number":
          output = `
          <div class="form-group">
            <label for="${item.name}">${item.label}</label>
            <p class="small text-muted" style="white-space: break-spaces">${item.hint}</p>
            <input
              placeholder="${item.placeholder}"
              value="${item.value}"
              max="${item.max}"
              min="${item.min}"
              step="${item.step}"
              type="${item.type}"
              id="${item.name}"
              name="${item.name}" ${item.require === true ? "data-require='1'" : ""}
              class="form-control ${item.class ? item.class : ""}">
          </div>
          `;
          break;
        default:
          output = `
          <div class="form-group">
            <label for="${item.name}">${item.label}</label>
            <p class="small text-muted" style="white-space: break-spaces">${item.hint}</p>
            <input
              placeholder="${item.placeholder}"
              value="${item.value}"
              maxlength="${item.maxlength}"
              type="${item.type}"
              id="${item.name}"
              name="${item.name}" ${item.require === true ? "data-require='1'" : ""}
              class="form-control ${item.class ? item.class : ""}">
          </div>
          `;
          break;
      }

      return output;
    }
  },
  mounted() {
  }
};
</script>


