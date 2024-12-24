lua 加载demo
```lua
local jsonStr = '{"position":{"x":0,"y":0,"z":0},"rotation":{"x":0,"y":0,"z":0},"scale":{"x":1,"y":1,"z":1},"visible":true,"children":[{"position":{"x":0,"y":0,"z":0},"rotation":{"x":0,"y":0,"z":0},"scale":{"x":1,"y":1,"z":1},"visible":true,"children":[],"fbx_url":"db://assets/test/3d/res/heguan_body_ani.FBX/heguan_body_ani.prefab"},{"position":{"x":0,"y":38,"z":-6},"rotation":{"x":60,"y":60,"z":60},"scale":{"x":1,"y":1,"z":1},"visible":true,"children":[],"fbx_url":"db://assets/test/3d/res/heguan_hand_ani.FBX/heguan_hand_ani.prefab"}]}'
    -- self.Items.Image_6:setVisible(false) 
local jsonData = json.decode(jsonStr);
local createNode 
createNode = function(data)
    local position = data.position
    local rotation = data.rotation
    local scale = data.scale
    local node 
    if data.fbx_url then
        local preStr = "db://assets/"
        local path = string.sub(data.fbx_url,string.len(preStr)+1,string.find(string.lower(data.fbx_url),'.fbx')-1)
        node = cc.Sprite3D:create(path .. ".c3b")
    else
        node = display.newNode()
    end
    for i, v in ipairs(data.children) do
        node:addChild(createNode(v))
    end
    node:setPosition3D(cc.vec3(position.x, position.y, position.z))
    node:setRotation3D(cc.vec3(rotation.x, rotation.y, rotation.z))
    node:setScaleX(scale.x)
    node:setScaleY(scale.y)
    node:setScaleZ(scale.z)
    -- 添加到默认场景需要把3d物品延后渲染
    node:setGlobalZOrder(1)
    node:setVisible(data.visible)
    return node
end
```