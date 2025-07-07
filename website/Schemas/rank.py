def find_rank(point):
    if point >= 0 and point <= 5000:
        return "Bronze"
    elif point >= 5000 and point <= 15000:
        return "Silver"
    elif point >= 15000 and point <= 30000:
        return "Gold"
    elif point >= 30000 and point <= 50000:
        return "Diamond"
    elif point >= 50000:
        return "Platinum"
def next_rank(point):
    if point >= 0 and point <= 5000:
        return {"next": "Silver", "point": 5000}
    elif point >= 5000 and point <= 15000:
        return {"next": "Gold", "point": 15000}
    elif point >= 15000 and point <= 30000:
        return {"next": "Diamond", "point": 30000}
    elif point >= 30000 and point <= 50000:
        return {"next": "Platinum", "point": 50000}
    elif point >= 50000:
        return {"next": "Max", "point": 50000}