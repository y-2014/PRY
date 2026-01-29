var lastModifiedDate = new Date(document.lastModified);
var year = lastModifiedDate.getFullYear();
var month = lastModifiedDate.getMonth() + 1;
var day = lastModifiedDate.getDate();
document.write(year + "年" + month + "月" + day + "日");
