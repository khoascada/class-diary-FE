class NotificationService {
  constructor() {
    this.messageApi = null;
  }
  setMessageApi(api) {
    this.messageApi = api;
  }

  success(content) {
    this.messageApi?.success(content);
  }

  error(content) {
    this.messageApi?.error(content);
  }

  loading(content) {
    return this.messageApi?.loading(content);
  }
}

export const notificationService = new NotificationService();
