public class SlidingWindow {
    public static int longestday(int[] arr, int budget)
    {
        int start = 0;
        int end = 0;
        int sum = 0;
        int maxlen = 0;
        for(end = 0; end<arr.length; end++)
        {
            sum += arr[end];
            while(sum > budget)
            {
                sum -= arr[start];
                start++;
            }
            maxlen = Math.max(maxlen, end - start +1);
        }
        return maxlen;
    }
}
