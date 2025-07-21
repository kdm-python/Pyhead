from pyhead.models import DiaryEntry, Medication

def get_avg_month_pain(data: list[DiaryEntry]) -> float:
    """
    Calculate the average pain score for the month from a list of DiaryEntry objects.
    
    Args:
        data (list[DiaryEntry]): List of diary entries for the month.
        
    Returns:
        float: Average pain score for the month, rounded to 2 decimal places.
    """
    if not data:
        return 0.0
    
    total_score = sum(entry.score for entry in data)
    avg_score = total_score / len(data)
    
    return round(avg_score, 2)


def get_num_month_cluster(data: list[DiaryEntry]) -> int:
    """
    Count the number of cluster headache days in a month's worth of diary entries.
    
    Args:
        data (list[DiaryEntry]): List of diary entries for the month.
        
    Returns:
        int: Number of cluster headaches days recorded in the month.
    """
    if not data:
        return 0
    
    return sum(1 for entry in data if entry.cluster)