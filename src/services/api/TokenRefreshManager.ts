import {setToken} from '../../features/authSlice';
import {AppDispatch} from '../../store';
import {axiosInstance} from './client';

class TokenRefreshManager {
  private isRefreshing = false;
  private refreshPromise: Promise<any> | null = null;
  private dispatch: AppDispatch | null = null;

  setDispatch(dispatch: AppDispatch) {
    this.dispatch = dispatch;
  }

  async refreshToken(refreshToken: string) {
    // If already refreshing, return the existing promise
    if (this.isRefreshing && this.refreshPromise) {
      return this.refreshPromise;
    }

    this.isRefreshing = true;

    this.refreshPromise = new Promise(async (resolve, reject) => {
      try {
        console.log('Starting global token refresh');

        const response = await axiosInstance.post(
          'REFRESH_TOKEN',
          {refreshToken},
          {skipLoader: true},
        );

        const responseData = response?.data;

        if (!responseData.access?.token || !responseData.refresh?.token) {
          console.error(
            'Unexpected response format:',
            JSON.stringify(responseData),
          );
          throw new Error('Invalid token response format');
        }

        const tokenData = {
          access: responseData.access,
          refresh: responseData.refresh,
        };

        if (this.dispatch) {
          this.dispatch(setToken(tokenData));
        }

        resolve(tokenData);
      } catch (error) {
        console.error('Global token refresh failed:', error);
        reject(error);
      } finally {
        this.isRefreshing = false;
        this.refreshPromise = null;
      }
    });

    return this.refreshPromise;
  }
}

export const tokenRefreshManager = new TokenRefreshManager();
export default tokenRefreshManager;
