<script>
    import { cartSelected } from "../store/MyWritableStore";

    let carts = [];
    cartSelected.subscribe((value) => {
        if (parseInt(value) != 0) {
            carts = value;
            console.log("carts");
            console.log(carts);
        }
    });

    async function getCarts() {
        console.log("Sedang get carts");
    }

    if (carts.length === 0) {
        getCarts();
    }
</script>

ini hal chekout
