<template>
  <div class="row">
    <div class="col-md-8">

      <table id="rpFields" class="table text-center table-striped table-responsive-md table-hover border">
        <thead>
        <tr>
          <th>ترتیب</th>
          <th>برچسب</th>
          <th>نام</th>
          <th>نوع</th>
          <th>مدیریت</th>
        </tr>
        </thead>
        <tbody class="ss">
        <tr v-for="field in userFields" :data-priority="field.priority">
          <td>{{ field.priority }}</td>
          <td>{{ field.label }}</td>
          <td>{{ field.name }}</td>
          <td>{{ field.type }}</td>
          <td>
            <button class="btn btn-danger" v-on:click="removeField(field)">حذف فیلد</button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>

    <div class="col-md">
      <div class="card" id="cfForm">
        <div class="card-header">
          مشخصات فیلد
        </div>

        <div class="card-body">
          <div class="form-group">
            <label for="label">برچسب</label>
            <p class="small text-muted">(این نامی است که در صفحه "ویرایش" نمایش داده خواهد شد)</p>
            <input type="text" data-require="1" name="label" id="label" class="form-control">
          </div>

          <div class="form-group">
            <label for="name">نام</label>
            <p class="small text-muted">(تک کلمه، بدون فاصله. خط زیرین و خط تیره ها مجازاند)</p>
            <input type="text" name="name" id="name" class="form-control" data-require="1">
          </div>

          <div class="form-group">
            <label for="type">نوع</label>
            <select name="type" id="type" class="form-control" v-on:change="selectType" data-require="1">
              <option v-for="option in fieldType" :value="option.type">{{ option.label }}</option>
            </select>
          </div>

          <div class="form-group">
            <label for="hint">دستورالعمل ها</label>
            <p class="small text-muted">دستورالعمل هایی برای نویسندگان. هنگام ارسال داده ها نمایش داده می شوند</p>
            <textarea name="hint" id="hint" class="form-control"></textarea>
          </div>

          <div class="form-group form-check">
            <label class="form-check-label">
              <input class="form-check-input" name="required" type="checkbox"> الزامی
            </label>
          </div>

          <div :class="Object.keys(selectedType).length<=0 ? 'spinner-grow text-warning' : ''" :style="Object.keys(selectedType).length<=0? 'margin: 0 8rem;' : ''">
            <div v-for="item in selectedType.options" v-html="generateInput(item)"></div>
          </div>

          <button class="btn btn-success" v-on:click="addNewField">{{ submitTitle }}</button>

        </div>

      </div>
    </div>

  </div>
</template>

<script>
export default {
  props: {
    fields: {
      default: "",
    }
  },
  data() {
    return {
      userFields: [
        {"priority": 1, "label": "Ali", "name": "Ali", "type": "text"},
        {"priority": 2, "label": "Reza", "name": "Reza", "type": "text"},
        {"priority": 3, "label": "Alex", "name": "Alex", "type": "text"},
        {"priority": 4, "label": "Jon", "name": "Jon", "type": "text"}
      ],
      fieldType: JSON.parse(this.fields),
      conditions: [],
      selectedType: [],
      submitType: "new",
      submitTitle: 'افزودن فیلد جدید'
    };
  },
  watch: {
    fields: function () {
    }
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
            <textarea type="${item.type}" name="${item.name}" id="${item.name}" ${item.require === true ? "data-require='1'" : ""} class="form-control ${item.class ? item.class : ""}"></textarea>
          </div>
          `;
          break;
        case "checkbox":
          output = `
            <div class="form-group form-check">
              <label class="form-check-label">
              <p class="small text-muted" style="white-space: break-spaces">${item.hint}</p>
              <input class="form-check-input ${item.class ? item.class : ""}" ${item.require === true ? "data-require='1'" : ""} name="${item.name}" type="checkbox"> ${item.label}
              </label>
            </div>
            `;
          break;
        default:
          output = `
          <div class="form-group">
            <label for="${item.name}">${item.label}</label>
            <p class="small text-muted" style="white-space: break-spaces">${item.hint}</p>
            <input type="${item.type}" name="${item.name}" id="${item.name}" ${item.require === true ? "data-require='1'" : ""} class="form-control ${item.class ? item.class : ""}">
          </div>
          `;
          break;
      }

      return output;
    },
    async selectType(element) {
      this.selectedType = []

      await new Promise(resolve => {
        setTimeout(() => {
          resolve('')
        }, 500);
      });

      this.selectedType = this.fieldType.find(x => x.type === $(element.target).val());
    },
    removeField(field) {
      const index = this.userFields.findIndex(x => x.label === field.label);
      this.userFields.splice(index, 1);

      let i = 1;
      this.userFields.map(x => x.priority = i++);

      this.sortFields();
    },
    sortFields() {
      this.userFields.sort(function (a, b) {
        return a.priority - b.priority;
      });
    },
    setPriority(item, pr) {
      item.find('td').eq(0).html(pr)
    },
    canSubmit() {
      let checkInput = true;
      $(".error").remove();
      $("#cfForm").find("[data-require='1']").each(function (i, item) {
        if ($(item).val() === "") {
          checkInput = false;
          $(item).addClass('border-danger');
          $(item).after('<p class="text-danger small error">فیلد موردنظر الزامی می‌باشد.</p>')
        }
      });
      return checkInput;
    },
    addNewField() {
      if (this.canSubmit())
        $("#cfForm").find("input, textarea, select").each(function (index, item) {
          console.log($(item).attr('name'), $(item).val())
        });
    }
  },
  mounted() {
    const vm = this;

    vm.sortFields();

    $('tbody').sortable({
      update() {
        $('tbody').find('tr').each(function (t, item) {
          vm.setPriority($(item), t + 1)
          $("#rpFields").find("tr[data-priority]").each(function (i, item) {
            vm.userFields[$(item).data("priority") - 1].priority = parseInt($(item).find("td").eq(0).text());
          });
        })
      }
    });

    this.selectedType = this.fieldType[0];
  }
};

</script>