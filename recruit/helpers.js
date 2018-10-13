var _ = require('underscore');

function helpers(){
  var self = this;

  self.supportedConnections = [
    {
      host:"www.linkedin.com",
      description: "LinkedIn",
      id: "linkedIn",
      idPath: "connections.linkedIn",
      getIdFromPath: function(path){
        var routeParts = path.split("/");
        var identifier = "in";
        if(routeParts.length > 1 && routeParts[1] === identifier){
          return routeParts[2];
        }
        return null;
      },
    },
    {
      host:"www.facebook.com",
      description: "Facebook",
      id: "facebook",
      idPath: "connections.facebook",
      getIdFromPath: function(path){
        return path.replace("/","");
      }
    }
  ];

  self.getFromSupportedConnection = function(host){
    return _.findWhere(self.supportedConnections, {host: host});
  };

  self.getUserInfoFromLink = function(connection, url){
  };

  self.isPropertySearch = function(searchString){
    const hasDots = searchString.indexOf(".") != -1;
    const hasColon = searchString.indexOf(":") != -1;
    return hasDots && hasColon;
  }

  self.getPropertyToSearch = function(searchString){
    var res = searchString.split(":");
    return {property:res[0], value: res[1]};
  }
};

module.exports = new helpers();
