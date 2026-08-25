public class SlidingWindowStreak {
    /**
     * Calculates the longest consecutive daily spending streak within budget limit.
     */
    public static int longestStreak(int[] daily, int budget) {
        int start = 0;
        int sum = 0;
        int maxLen = 0;
        for (int end = 0; end < daily.length; end++) {
            sum += daily[end];
            while (sum > budget) {
                sum -= daily[start];
                start++;
            }
            maxLen = Math.max(maxLen, end - start + 1);
        }
        return maxLen;
    }
}
