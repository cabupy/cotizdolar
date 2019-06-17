const moment = require('moment');

module.exports = {
  truncate: function(str, len){
    if (str.length > len && str.length > 0) {
			var new_str = str + " ";
			new_str = str.substr(0, len);
			new_str = str.substr(0, new_str.lastIndexOf(" "));
			new_str = (new_str.length > 0) ? new_str : str.substr(0, len);
			return new_str + '...';
		}
		return str;
  },
  formatDate: function(date, format){
    return moment(date).format(format);
  },
  formatNumber: function(num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
  },
  toUpperCase: function(str){
    return str.toUpperCase();
  },
  fourth: function(i){
    i = i+1;
    //console.log('Ver:', i, (i%4===0));
    return i%4===0;
  }
  
}