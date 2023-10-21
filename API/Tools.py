import requests
import json

class AnimeRankingTool:
    name = 'AnimeRanking'
    description = (
      'Useful if you are looking for anime rankings.'
      'The input has one key "rank" and contains the ranking of the anime. If no rank is specified, then "rank" will be set to None.'
    )

    def _run(self, rank):
        print("--------------------------------"+str(rank))
        #ランキングを格納する配列を生成
        anime_rank_array = []
        anime_rank_array.clear()
        return_prompt =""

        #アニメランキングを取得する
        url = requests.get("https://anime.dmkt-sp.jp/animestore/rest/WS000103?rankingType=01")
        text = url.text
        data = json.loads(text)

        #アニメランキングを0番目の配列から順番に格納
        for i in range(0, 300):
            title = data["data"]['workList'][i]['workInfo']['workTitle']
            #アニメのタイトルを格納します。
            anime_rank_array.append(title)
        if rank != None:
            # return_prompt = f"dアニメランキングでは'{anime_rank_array[rank-1]}'が{rank}位です。"
            return_prompt = f"dアニメランキングによると、'{anime_rank_array[rank-1]}' は No. {rank}です。"

        elif rank == None:
            #順位の指定がない場合はTOP10を表示する。
            return_prompt="dアニメランキングのトップ10は以下の通りです。\n"

            #0から順にサーベイするので、anime_rank_arrayはそのままindex値を格納し、順位は+1する。
            for i in range(0,10):
                return_prompt = return_prompt + f"'{anime_rank_array[i]}'is No. {i+1}.\n"
        #300位以上のランキングは格納していないので、警告を返す        
        elif rank > 300:
            return "dAnime Rankingに保存されているランキングの総数は最大300までです。それを超えるランキングは提供できません。"
            exit
        # print(return_prompt)
        return return_prompt