<script>
    import { cartSelected } from "../store/MyWritableStore";

    cartSelected.subscribe((value) => {
        console.log("value");
        console.log(value);
    });
</script>

ini hal chekout
