let err_maintain = Response.error("đang bảo trì");
let err_hight_load = Response.error("truy cập quá nhanh, vui lòng chỉnh 1 luồng 2 giây");

function replace_domain(originalUrl, newDomain) {
  return originalUrl.replace(/^https?:\/\/[^\/]+/, newDomain);
}

function removeEndTrailingSlash(str) {
  if (str.endsWith("/")) {
    return str.slice(0, -1);
  }
  return str;
}

function convertVietnameseToASCII(str) {
  var vietnameseMap = {
    "á": "a",
    "à": "a",
    "ả": "a",
    "ã": "a",
    "ạ": "a",
    "ă": "a",
    "ắ": "a",
    "ằ": "a",
    "ẳ": "a",
    "ẵ": "a",
    "ặ": "a",
    "â": "a",
    "ấ": "a",
    "ầ": "a",
    "ẩ": "a",
    "ẫ": "a",
    "ậ": "a",
    "đ": "d",
    "é": "e",
    "è": "e",
    "ẻ": "e",
    "ẽ": "e",
    "ẹ": "e",
    "ê": "e",
    "ế": "e",
    "ề": "e",
    "ể": "e",
    "ễ": "e",
    "ệ": "e",
    "í": "i",
    "ì": "i",
    "ỉ": "i",
    "ĩ": "i",
    "ị": "i",
    "ó": "o",
    "ò": "o",
    "ỏ": "o",
    "õ": "o",
    "ọ": "o",
    "ô": "o",
    "ố": "o",
    "ồ": "o",
    "ổ": "o",
    "ỗ": "o",
    "ộ": "o",
    "ơ": "o",
    "ớ": "o",
    "ờ": "o",
    "ở": "o",
    "ỡ": "o",
    "ợ": "o",
    "ú": "u",
    "ù": "u",
    "ủ": "u",
    "ũ": "u",
    "ụ": "u",
    "ư": "u",
    "ứ": "u",
    "ừ": "u",
    "ử": "u",
    "ữ": "u",
    "ự": "u",
    "ý": "y",
    "ỳ": "y",
    "ỷ": "y",
    "ỹ": "y",
    "ỵ": "y",
  };

  // Replace Vietnamese characters with their ASCII equivalents
  return str.replace(
    /[\u00C0-\u1EF9\u1EFB-\u1EFC\u1EE8-\u1EEF\u1BAA-\u1BE5]/g,
    function (matched) {
      return vietnameseMap[matched] || matched;
    },
  );
}
