using UnityEngine;
using System.Collections;

//Kinematic projectile.  Collides with limited layers, applies force to non-kinematic rigidbodies.
public class BaseProjectileCS : MonoBehaviour {

  public LayerMask colliderLayerMask;
  public Vector3 velocity;
  public float damageValue = 1;
  public float impactValue = 1;

  public float lifespan = 5;
  
  public bool bDebug = false;

	// Use this for initialization
	void Start () {
    //Set defaults.  If these fail, it's probably not going to work right.
    collider.isTrigger = true;
    rigidbody.isKinematic = true;
	}
	
	// Update is called once per frame
	void Update () {

	
	}

  public void FixedUpdate()
  {
    transform.position = transform.position + velocity * Time.deltaTime;
    lifespan -= Time.fixedDeltaTime;
    if (lifespan < 0) Destroy(this.gameObject);
  }

  public void OnTriggerEnter (Collider other) 
  {
    if(bDebug) Debug.Log("Projectile Trigger");
    BaseHealthCS collisionHealth;
    
    if(((1 << other.gameObject.layer) & colliderLayerMask.value) > 0)
    {
      collisionHealth = (BaseHealthCS) other.gameObject.GetComponent(typeof(BaseHealthCS));
    
    	if(collisionHealth == null && other.transform.parent != null) collisionHealth = (BaseHealthCS) other.transform.root.GetComponent(typeof(BaseHealthCS));
    	
		if(damageValue > 0 && collisionHealth)
		{
			collisionHealth.ReceiveDamage(damageValue);
		}
		
		if(other.rigidbody && damageValue > 0)
		{
			if(bDebug) Debug.Log("Projectile impact: " + transform.position);
			other.rigidbody.AddForce(velocity, ForceMode.Impulse);
		}
		
		damageValue = 0;
		Destroy(this.gameObject);
    }
}

}
