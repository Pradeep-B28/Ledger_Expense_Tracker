public class SlidingWindow {
    public static int longest(int arr[], int budget)
    {
        int start = 0;
        int end = 0;
        int sum = 0;
        int max = 0;
        for(end = 0; end< arr.length ; end++)
        {
            sum += arr[end];
            while(sum > budget)
            {
                sum -= arr[start];
                start++;
            }
            max = Math.max(max, end-start+1);
        }
        return max;
    }
}
