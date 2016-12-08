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
        return path.replace("/in/","");
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
};

module.exports = new helpers();
