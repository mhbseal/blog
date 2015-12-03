import rules from './rules';

export default (parent, inputs) => {
  let
    refs = parent.refs,
    data = {};

  for (let input of inputs) {
    if (data) {
      let
        name = input.name,
        names = input.names;

      if (names) {
        let i = 0, ref;
        while (ref = refs[names + i]) {
          i++;
          if (ref.checked) {
            if (!data[names]) data[names] = [];
            data[names].push(ref.value);
          }
        }
      }

      if (name) {
        data[name] = refs[name].value;
        if (input.rules) { // 需要校验
          for (let rule of input.rules.entries()) {
            if (!rules[rule[1]](data[name])) {
              parent.setState({
                validateMsg: input.msgs[rule[0]],
                showAlert: true,
              });
              data = null;
              break;
            } else {
              parent.setState({validateMsg: null});
            }
          }
        }
      }

    } else {
      break;
    }
  };

  return data;
};
