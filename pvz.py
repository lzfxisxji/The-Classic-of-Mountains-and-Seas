import pygame
import random

# 初始化
pygame.init()
WIDTH, HEIGHT = 800, 500
screen = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption("简易植物大战僵尸")
clock = pygame.time.Clock()
FPS = 60

# 颜色
GREEN = (34, 139, 34)
GRASS = (120, 180, 80)
BROWN = (139, 69, 19)
RED = (255, 0, 0)
YELLOW = (255, 255, 0)

GRID_COLS = 8
GRID_ROWS = 5
CELL_W = WIDTH // GRID_COLS
CELL_H = HEIGHT // GRID_ROWS

sun = 150  # 阳光

plants = []
bullets = []
zombies = []

# 植物类
class Plant:
    def __init__(self, col, row, ptype):
        self.col = col
        self.row = row
        self.x = col * CELL_W + CELL_W//2
        self.y = row * CELL_H + CELL_H//2
        self.type = ptype  # sunflower / peashooter
        self.cd = 0

    def update(self):
        self.cd +=1
        if self.type == "sunflower" and self.cd >= 120:
            global sun
            sun +=25
            self.cd =0
        if self.type == "peashooter" and self.cd >=90:
            bullets.append(Bullet(self.x+20, self.y))
            self.cd =0

    def draw(self):
        if self.type == "sunflower":
            pygame.draw.circle(screen, YELLOW, (int(self.x), int(self.y)),18)
        else:
            pygame.draw.circle(screen, (0,120,200), (int(self.x), int(self.y)),18)

# 子弹
class Bullet:
    def __init__(self, x, y):
        self.x = x
        self.y = y
        self.speed = 6
        self.r =6
    def update(self):
        self.x += self.speed
    def draw(self):
        pygame.draw.circle(screen, (255,255,0), (int(self.x), int(self.y)), self.r)

# 僵尸
class Zombie:
    def __init__(self, row):
        self.row = row
        self.y = row * CELL_H + CELL_H//2
        self.x = WIDTH
        self.hp = 80
        self.speed = 0.4
    def update(self):
        self.x -= self.speed
    def draw(self):
        pygame.draw.rect(screen, BROWN, (self.x-20, self.y-22,40,44))
        # 血条
        pygame.draw.rect(screen,RED,(self.x-20,self.y-30,40*(self.hp/80),4))

# 绘制草地网格
def draw_map():
    for r in range(GRID_ROWS):
        for c in range(GRID_COLS):
            rect = pygame.Rect(c*CELL_W, r*CELL_H, CELL_W-2, CELL_H-2)
            pygame.draw.rect(screen, GRASS, rect)

running = True
spawn_timer =0

while running:
    screen.fill((0,0,0))
    draw_map()
    dt = clock.tick(FPS)

    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
        if event.type == pygame.MOUSEBUTTONDOWN:
            mx, my = pygame.mouse.get_pos()
            c = mx // CELL_W
            r = my // CELL_H
            # 判断格子有没有植物
            exist = any(p.col==c and p.row==r for p in plants)
            if not exist:
                # 鼠标左键：豌豆射手(100阳光)，右键向日葵(50阳光)
                if event.button ==1 and sun >=100:
                    plants.append(Plant(c,r,"peashooter"))
                    sun -=100
                elif event.button ==3 and sun >=50:
                    plants.append(Plant(c,r,"sunflower"))
                    sun -=50

    # 生成僵尸
    spawn_timer +=1
    if spawn_timer >=220:
        zombies.append(Zombie(random.randint(0,GRID_ROWS-1)))
        spawn_timer =0

    # 更新植物
    for p in plants:
        p.update()
        p.draw()

    # 更新子弹
    for b in bullets[:]:
        b.update()
        b.draw()
        if b.x > WIDTH:
            bullets.remove(b)

    # 更新僵尸
    for z in zombies[:]:
        z.update()
        z.draw()
        if z.x < 0:
            print("僵尸入侵！游戏结束")
            running = False

    # 子弹碰撞僵尸
    for b in bullets[:]:
        for z in zombies[:]:
            dx = b.x - z.x
            dy = b.y - z.y
            if abs(dx)<25 and abs(dy)<25:
                z.hp -=12
                if b in bullets:
                    bullets.remove(b)
                if z.hp <=0:
                    zombies.remove(z)
                break

    # 显示阳光
    font = pygame.font.SysFont(None,32)
    txt = font.render(f"阳光:{sun}",True,YELLOW)
    screen.blit(txt,(10,10))

    pygame.display.flip()

pygame.quit()