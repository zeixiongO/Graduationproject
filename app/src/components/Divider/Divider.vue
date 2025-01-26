<template>
    <div class="d">
        <el-divider>
            <div class="container">
                <slot>

                </slot>
            </div>
        </el-divider>
    </div>
</template>

<style scoped lang="less">
.d {
    margin: 3rem 0;

    .container {
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: "song";
        color: var(--primary-color);
        user-select: none;
        font-size: 1.1rem;

    }
}
</style>