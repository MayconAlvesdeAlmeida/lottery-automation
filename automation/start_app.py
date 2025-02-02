import requests, json, os, signal, sys

from selenium import webdriver
from selenium.webdriver.firefox.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

from time import sleep
from datetime import datetime
from typing import List, Union


class LotoFacilAgent:
    def __init__(self) -> None:
        signal.signal(signal.SIGINT, self.stop_app)
        signal.signal(signal.SIGTERM, self.stop_app)

        if not self.config_app():
            sys.exit(1)


    def config_app(self) -> bool:
        config_path = 'config_app.json'

        if not os.path.exists(config_path):
            self.log(f'Arquivo de configuracao nao encontrado: {config_path}')
            return False

        with open('config_app.json') as f:
            self.config = json.load(f)

        self.log('Aplicação iniciada')

        driver_path = os.path.join('driver', 'geckodriver.exe')
        if not os.path.exists(driver_path):
            self.log(f'Arquivo de driver nao encontrado: {driver_path}')
            return False

        service = Service(executable_path=driver_path)

        self.driver = webdriver.Firefox(service=service)
        self.driver.maximize_window()

        return True


    def log(self, message:str) -> None:
        now = datetime.now().strftime('%Y-%m-%d %H:%M:%S.%f')[:-3]
        print(f'{now}|{os.getpid()}|{message}')	


    def check_duplicate_games(self, players: List) -> bool:
        games = set()

        for player in players:
            game = tuple(player['chosenNumbers'])
            if game in games:
                self.log(f'jogo duplicado: {game} -> jogador: {player["name"]}')
                return True
            
            games.add(game)

        return False


    def get_players(self, contest_number:Union[str, int]) -> dict:
        url = f'http://localhost:3000/lottery/{contest_number}'

        try:
            resp = requests.get(url)
            if resp.status_code != 200:
                self.log(f'Falha na busca por jogadores: {resp.status_code}')
                return {}
            return json.loads(resp.text)['players']

        except Exception as e:
            self.log(f'Falha na busca por jogadores: {e}')
            return {}


    def choose_numbers(self, player:dict) -> None:
        scripts = []
        for number in player['chosenNumbers']:
            key = f'n0{number}' if number < 10 else f'n{number}'
            script_command = f'document.getElementById("{key}").click()'
            scripts.append(script_command)

        self.driver.execute_script(';'.join(scripts))

        
    def is_element_present(self, by, value, timeout=10) -> bool:
        try:
            WebDriverWait(self.driver, timeout).until(
                EC.presence_of_element_located((by, value))
            )
            return True
        except Exception as e:
            self.log(f'element not found: {e}')

        return False


    def get_new_contest_number(self) -> str:
        while True:
            sleep(1)

            try:
                element = self.driver.find_element(By.ID, 'modal-ref')
                value = element.text
                
                if value.find('Processando, aguarde...') == -1:
                    continue

                contest_number = value.split(':')[-1].strip()
                self.log(f'Encontrado numero de concurso: {contest_number}')
                return contest_number
            
            except:
                pass


    def wait_for_payment_confirmation(self):
        while True:
            sleep(10)

            try:
                element = self.driver.find_element(By.ID, 'containerProcessamento')
                value = element.text

                if value.find('Seu pedido foi realizado') == -1:
                    continue

                break
            except:
                pass


    def stop_app(self, signum, frame):
        self.log('Aplicação encerrada')
        sys.exit(0)


    def start_app(self):
        try:
            self.driver.get(self.config['url_app'])

            contest_number = self.get_new_contest_number()
            contest_type = 'lotofacil'
            players = self.get_players(contest_number)

            self.driver.get(self.config['url_lotofacil'])

            if self.is_element_present(By.ID, 'adopt-accept-all-button'):
                self.log('necessario aceitar os cookies da pagina.\n')
                element = self.driver.find_element(By.ID, 'adopt-accept-all-button')
                element.click()

            if self.is_element_present(By.ID, 'botaosim'):
                self.log('necessario informar que e maior de idade.\n')
                element = self.driver.find_element(By.ID, 'botaosim')
                element.click()

            if not self.is_element_present(By.ID, 'Lotofácil'):
                self.log('os cliques falharam. Sera necessario recarregar a pagina')
                sys.exit(1)

            self.driver.get(f'https://www.loteriasonline.caixa.gov.br/silce-web/?utm_source=site_loterias&utm_medium=aplicativos#/{contest_type}')

            for player in players:
                if not self.is_element_present(By.ID, 'n01'):
                    self.log('pagina de jogos nao foi encontrada. verificar pagina.')
                    sys.exit(1)

                self.driver.execute_script("window.scrollTo(0, 400);")

                self.choose_numbers(player)

                element = self.driver.find_element(By.ID, 'colocarnocarrinho')
                self.driver.execute_script("window.scrollTo(0, 900);")

                sleep(1)

                element.click()

                if not self.is_element_present(By.ID, 'div_alertas'):
                    self.log('nao foi encontrada tela informando que o jogo foi inserido com sucesso')
                    sys.exit(1)

                element = self.driver.find_element(By.ID, 'div_alertas')
                if not 'inserida no carrinho com sucesso' in element.text:
                    sys.exit(1)

                self.log(f'{player["name"]} - jogo inserido com sucesso\n\n')
                self.driver.execute_script("window.scrollTo(0, 400);")
                sleep(1)

            input('Aperte enter para finalizar a aplicacao: ')

            self.log('Finalizando aplicação')
            self.driver.quit()

            self.log('Aplicação finalizada com sucesso')
        except Exception as e:
            self.log(f'Falha durante a execução da aplicação: {e}')


if __name__ == '__main__':
    LotoFacilAgent().start_app()