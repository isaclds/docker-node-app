export default function createResponse(success, title, detail, status) {
  return { success: success, title: title, detail: detail, status: status };
}
