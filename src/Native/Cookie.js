Elm.Native.Cookie = {};
Elm.Native.Cookie.make = function(localRuntime) {

  localRuntime.Native = localRuntime.Native || {};
  localRuntime.Native.Cookie = localRuntime.Native.Cookie || {};
  if (localRuntime.Native.Cookie.values)
  {
    return localRuntime.Native.Cookie.values;
  }

  var Task = Elm.Native.Task.make(localRuntime);
  var Maybe = Elm.Maybe.make(localRuntime);

  var howToGetACookie = function(sKey) {
    return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
  }

  function set(co) 
  {
    key = co.key;
    value = co.value;

    return Task.asyncFunction(function(callback) {
      var setcommand = encodeURIComponent(key) + "=" + encodeURIComponent(value)
      document.cookie = setcommand
      var newValue = howToGetACookie(key)
      if (newValue === value)
      {
        callback(Task.succeed({key: key, value: value}));  
      } else {
        callback(Task.fail("cookie " + setcommand + " was not set. It holds <" + newValue + ">"));
      }
    });
  }

  function get(key)
  {
    return Task.asyncFunction(function(callback) {
      var value = howToGetACookie(key)
      if (!value) {
        callback(Task.succeed(Maybe.Nothing));
      } else {
        var output = {key: key, value: value};
        callback(Task.succeed(Maybe.Just(output)));
      }
    });
  }   

  return localRuntime.Native.Cookie.values = {
    set: set,
    get: get
  };

}