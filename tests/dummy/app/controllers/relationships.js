import Controller from '@ember/controller';

export default Controller.extend({
    actions: {
        changed: function(new_role_id) {
            let user = this.get("model");
            user.change_role(new_role_id);
        }
    }
});
