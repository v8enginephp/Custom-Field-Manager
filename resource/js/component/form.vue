<template>
  <div class="row p-3 rounded" :style="'background:'+bg">
    <div class="col-md-8">

      <div class="card">
        <div class="card-header">
          ضمینه های سفارشی
        </div>
        <div class="card-body">
          <table id="rpFields" class="text-center table table-striped table-responsive-md table-hover table-borderless">
            <thead>
            <tr role="row">
              <th class="all text-center sorting">ترتیب</th>
              <th class="all text-center sorting">برچسب</th>
              <th class="all text-center sorting">نام</th>
              <th class="all text-center sorting">نوع</th>
              <th class="all text-center sorting">مدیریت</th>
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
      </div>

      <hr>

      <div class="card">
        <div class="card-header">نمایش این گروه اگر</div>
        <div class="card-body">
          <div class="form-group row">
            <div class="col-md">
              <select class="form-control" v-model:value="conditions[0]['type']">
                <option value="post">نوع نوشته</option>
              </select>
            </div>
            <div class="col-md">

              <select class="form-control" v-model:value="conditions[0]['condition']">
                <option value="==">برابر با</option>
                <option value="!=">مخالف با</option>
              </select>
            </div>

            <div class="col-md">
              <select name="condition_location" id="kind" class="form-control" v-model:value="conditions[0]['location']">
                <option value="">یک گزینه را انتخاب فرمایید.</option>
                <option v-for="item in filed_condition" :value="item.key">{{ item.value }}</option>
              </select>
            </div>
          </div>

          <form :action="action" method="post" id="submitCf">
            <input type="hidden" name="inputs" v-model:value="JSON.stringify(userFields)">
            <input type="hidden" name="condition" v-model:value="JSON.stringify(conditions)">
            <button type="button" class="btn btn-success px-5 btn" id="submitBtn">
              <i class="fa-floppy-o fa"></i>
              ذخیره
            </button>
          </form>

        </div>
      </div>
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
            <input type="text" data-require="1" id="label" class="form-control">
          </div>

          <div class="form-group">
            <label for="name">نام</label>
            <p class="small text-muted">(تک کلمه، بدون فاصله. خط زیرین و خط تیره ها مجازاند)</p>
            <input type="text" id="name" class="form-control" data-require="1">
          </div>

          <div class="form-group">
            <label for="type">نوع</label>
            <select id="type" class="form-control" v-on:change="selectType" data-require="1">
              <option v-for="option in fieldType" :value="option.type">{{ option.label }}</option>
            </select>
          </div>

          <div class="form-group">
            <label for="hint">دستورالعمل ها</label>
            <p class="small text-muted">دستورالعمل هایی برای نویسندگان. هنگام ارسال داده ها نمایش داده می شوند</p>
            <textarea id="hint" class="form-control"></textarea>
          </div>

          <div class="form-group form-check">
            <label class="form-check-label">
              <input class="form-check-input" id="required" type="checkbox"> الزامی
            </label>
          </div>

          <div :class="Object.keys(selectedType).length<=0 ? 'spinner-grow text-warning' : ''" :style="Object.keys(selectedType).length<=0? 'margin: 0 8rem;' : ''">
            <div v-for="item in selectedType.options" v-html="generateInput(item)"></div>
          </div>

          <button type="button" class="btn btn-success" v-on:click="addNewField">{{ submitTitle }}</button>

        </div>

      </div>
    </div>

  </div>
</template>

<script>
export default {
  props: {
    bg: {
      required: false
    },
    fields: {
      default: "",
    },
    action: {
      required: true
    },
    location: {
      required: true,
    },
    user_fields: {
      required: false,
      default: '[]'
    },
    user_condition: {
      required: false,
      default: '[{"type": "post", "condition": "==", "location": ""}]'
    }
  },
  data() {
    return {
      priority: 1,
      userFields: JSON.parse(this.user_fields),
      fieldType: JSON.parse(this.fields),
      conditions: JSON.parse(this.user_condition),
      filed_condition: JSON.parse(this.location),
      selectedType: [],
      submitType: "new",
      submitTitle: 'افزودن فیلد جدید',
    };
  },
  watch: {
    fields: function () {
    },
    userFields: function () {
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
            <textarea type="${item.type}" id="${item.name}" ${item.require === true ? "data-require='1'" : ""} class="form-control ${item.class ? item.class : ""}"></textarea>
          </div>
          `;
          break;
        case "checkbox":
          output = `
            <div class="form-group form-check">
              <label class="form-check-label">
              <p class="small text-muted" style="white-space: break-spaces">${item.hint}</p>
              <input class="form-check-input ${item.class ? item.class : ""}" ${item.require === true ? "data-require='1'" : ""} type="checkbox"> ${item.label}
              </label>
            </div>
            `;
          break;
        default:
          output = `
          <div class="form-group">
            <label for="${item.name}">${item.label}</label>
            <p class="small text-muted" style="white-space: break-spaces">${item.hint}</p>
            <input type="${item.type}" id="${item.name}" ${item.require === true ? "data-require='1'" : ""} class="form-control ${item.class ? item.class : ""}">
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
      this.priority--;
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
      $(".border-danger").removeClass('border-danger');
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
      let input = {};
      if (this.canSubmit()) {
        input['priority'] = this.priority++;
        $("#cfForm").find("input, textarea, select").each(function (index, item) {
          input[$(item).attr('id')] = $(item).val();

          if ($(item).attr('id') !== 'type')
            $(item).val("");

          if ($(item).prop("type") === 'checkbox') {
            input[$(item).attr('id')] = $(item).is(":checked");
            $(item).prop('checked', false);
          }
        });
        this.userFields.push(input);
      }
    },
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


