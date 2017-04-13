const Settings = {
  form: document.getElementById("settings"),
  load: function() {
    const { form } = this;
    return new Promise((resolve, error) => {
      form.addEventListener("submit", e => {
        e.preventDefault();
        const form = this.form;
        form.style.display = "none";
        // If configuration file load worldConfig
        // Else load form settings
        const file = form.file.files[0];
        if (file !== undefined) {
          const reader = new FileReader();
          reader.readAsText(form.file.files[0]);
          reader.onload = function(event) {
            const config = JSON.parse(event.target.result);
            resolve(config);
          };
        } else {
          resolve({
            width: parseInt(form.width.value),
            height: parseInt(form.height.value),
            tileSize: parseInt(form.tileSize.value)
          });
        }
      });
    });
  }
};

export default Settings;
