export const fullscreenUtils = {
  async enter(): Promise<boolean> {
    try {
      if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
        return true;
      }
    } catch {
      return false;
    }
    return false;
  },

  async exit(): Promise<void> {
    try {
      if (document.exitFullscreen && document.fullscreenElement) {
        await document.exitFullscreen();
      }
    } catch {
      // Ignore errors
    }
  },

  async toggle(): Promise<boolean> {
    if (document.fullscreenElement) {
      await this.exit();
      return false;
    } else {
      return await this.enter();
    }
  },

  isFullscreen(): boolean {
    return !!document.fullscreenElement;
  },
};