import random

def janken():
    """
    コンピュータとじゃんけんを行う関数
    """
    hands = ["グー", "チョキ", "パー"]
    
    print("じゃんけんを始めます！")
    
    while True:
        # プレイヤーの手を入力
        while True:
            try:
                player_hand_num = int(input("あなたの手を選んでください (0: グー, 1: チョキ, 2: パー): "))
                if player_hand_num in [0, 1, 2]:
                    break
                else:
                    print("0, 1, 2のいずれかを入力してください。")
            except ValueError:
                print("数値を入力してください。")

        player_hand = hands[player_hand_num]
        
        # コンピュータの手をランダムに決定
        computer_hand_num = random.randint(0, 2)
        computer_hand = hands[computer_hand_num]
        
        print(f"あなた: {player_hand}")
        print(f"コンピュータ: {computer_hand}")
        
        # 勝敗判定
        # (プレイヤーの手 - コンピュータの手 + 3) % 3
        # 0: あいこ, 1: 負け, 2: 勝ち
        result = (player_hand_num - computer_hand_num + 3) % 3
        
        if result == 0:
            print("あいこです。もう一度！")
            continue
        elif result == 2:
            print("あなたの勝ちです！")
        else:
            print("あなたの負けです。")
            
        # 再戦の確認
        while True:
            again = input("もう一度遊びますか？ (y/n): ").lower()
            if again in ["y", "n"]:
                break
            else:
                print("yかnを入力してください。")
        
        if again == "n":
            print("遊んでくれてありがとう！")
            break

if __name__ == "__main__":
    janken()
